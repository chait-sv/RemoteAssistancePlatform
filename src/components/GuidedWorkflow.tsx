import { useState } from "react";
import { ArrowRight, Check, Plug, Unplug, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useScenario, ScenarioId } from "@/contexts/ScenarioContext";

interface GuidedWorkflowProps {
  autonomy: {
    action: string;
    actionColor: string;
    warning: string | null;
    specialButton: string | null;
  };
  onResolve: () => void;
  onNavigate: (nav: string) => void;
}

const steps = [
  { label: "Connect", icon: Plug },
  { label: "Act", icon: ArrowRight },
  { label: "Disconnect", icon: Unplug },
  { label: "Resolve", icon: CheckCircle2 },
];

const scenarioRadioOptions: Record<string, { label: string; value: string; color?: string }[]> = {
  "INT-4821": [
    { label: "Waypoint 1", value: "waypoint-1" },
    { label: "Waypoint 2", value: "waypoint-2" },
  ],
  "INT-4822": [
    { label: "Approve", value: "approve" },
    { label: "Reject", value: "reject" },
  ],
  "INT-4823": [
    { label: "Approve Proposed Route A (U-Turn + Detour)", value: "route-a", color: "text-blue-400" },
    { label: "Approve Proposed Route B (Left Turn + Alt Street)", value: "route-b", color: "text-green-400" },
  ],
};

const GuidedWorkflow = ({ autonomy, onResolve, onNavigate }: GuidedWorkflowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [resolveOpen, setResolveOpen] = useState(false);
  const [faultCategory, setFaultCategory] = useState("");
  const [flagSimReview, setFlagSimReview] = useState(false);
  const [radioSelection, setRadioSelection] = useState("");
  const { activeTicket, setActiveTicket } = useScenario();

  const ticketOrder: ScenarioId[] = ["INT-4821", "INT-4822", "INT-4823"];

  const radioOptions = scenarioRadioOptions[activeTicket];

  const handleStepAction = () => {
    if (currentStep < 3) {
      setCurrentStep((s) => s + 1);
      if (currentStep === 1) setRadioSelection("");
    } else {
      setResolveOpen(true);
    }
  };

  const handleSubmitPipeline = () => {
    setResolveOpen(false);
    setCurrentStep(0);
    setFaultCategory("");
    setFlagSimReview(false);
    setRadioSelection("");
    toast({
      title: "Edge case tagged and submitted successfully",
      className: "bg-accent text-accent-foreground border-accent",
    });
    const currentIndex = ticketOrder.indexOf(activeTicket);
    const isLastTicket = currentIndex === ticketOrder.length - 1;
    setTimeout(() => {
      if (isLastTicket) {
        onNavigate("Tasks");
      } else {
        const nextTicket = ticketOrder[currentIndex + 1];
        setActiveTicket(nextTicket);
        onResolve();
      }
    }, 2000);
  };

  return (
    <>
      <div className="panel-border">
        <div className="panel-header">Guided Autonomy Controls</div>
        <div className="p-3 space-y-3">
          {/* Step indicators */}
          <div className="flex items-center gap-1">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === currentStep;
              const isDone = i < currentStep;
              return (
                <div key={step.label} className="flex items-center gap-1 flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                        isDone
                          ? "bg-accent text-accent-foreground"
                          : isActive
                          ? "bg-primary text-primary-foreground ring-2 ring-primary/40"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {isDone ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                    </div>
                    <span className={`text-[11px] mt-0.5 font-mono ${isActive ? "text-primary" : isDone ? "text-accent" : "text-muted-foreground"}`}>
                      {step.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`h-px w-full mt-[-10px] ${i < currentStep ? "bg-accent" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step 0: Connect */}
          {currentStep === 0 && (
            <Button variant="command" size="lg" className="w-full gap-2" onClick={handleStepAction}>
              <Plug className="h-4 w-4" />
              Connect to Vehicle
            </Button>
          )}

          {/* Step 1: Action + Execute */}
          {currentStep === 1 && (
            <div className="space-y-2">
              {autonomy.warning && (
                <div className="flex items-start gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                  <span className="text-xs text-warning font-semibold">{autonomy.warning}</span>
                </div>
              )}
              {autonomy.action && (
                <div className={`text-xs ${autonomy.actionColor} font-semibold`}>
                  {autonomy.action}
                </div>
              )}
              {radioOptions && (
                <RadioGroup value={radioSelection} onValueChange={setRadioSelection} className="space-y-1.5">
                 {radioOptions.map((opt) => (
                    <div key={opt.value} className="flex items-center gap-2">
                      <RadioGroupItem value={opt.value} id={opt.value} />
                      <Label htmlFor={opt.value} className={`text-xs cursor-pointer ${opt.color || "text-foreground"}`}>{opt.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              {autonomy.specialButton && (
                <Button variant="destructive" size="sm" className="w-full text-xs">
                  {autonomy.specialButton}
                </Button>
              )}
              <Button
                variant="command"
                size="lg"
                className="w-full gap-2"
                onClick={handleStepAction}
                disabled={!!radioOptions && !radioSelection}
              >
                <ArrowRight className="h-4 w-4" />
                Execute
              </Button>
              <div className="flex gap-1.5">
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  Hold Position
                </Button>
                <Button variant="destructive" size="sm" className="flex-1 text-xs">
                  E-Stop
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Disconnect */}
          {currentStep === 2 && (
            <Button variant="warning" size="lg" className="w-full gap-2" onClick={handleStepAction}>
              <Unplug className="h-4 w-4" />
              Disconnect from Vehicle
            </Button>
          )}

          {/* Step 3: Resolve */}
          {currentStep === 3 && (
            <Button variant="command" size="lg" className="w-full gap-2" onClick={handleStepAction}>
              <CheckCircle2 className="h-4 w-4" />
              Resolve Ticket
            </Button>
          )}
        </div>
      </div>

      {/* Resolve Modal */}
      <Dialog open={resolveOpen} onOpenChange={setResolveOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground text-base">Submit Edge Case to Nuro Driver ML Pipeline</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Primary Fault Category</label>
              <Select value={faultCategory} onValueChange={setFaultCategory}>
                <SelectTrigger className="bg-secondary border-border text-foreground">
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weather">Weather</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="routing">Routing</SelectItem>
                  <SelectItem value="human-actor">Human Actor</SelectItem>
                  <SelectItem value="sensor-fault">Sensor Fault</SelectItem>
                  <SelectItem value="rescue-escalation">Rescue Escalation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="sim-review"
                checked={flagSimReview}
                onCheckedChange={(c) => setFlagSimReview(c === true)}
              />
              <label htmlFor="sim-review" className="text-xs text-foreground cursor-pointer">
                Flag for high-priority Simulation review
              </label>
            </div>
            <Button
              onClick={handleSubmitPipeline}
              size="lg"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              Submit to Pipeline & Load Next Ticket
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GuidedWorkflow;