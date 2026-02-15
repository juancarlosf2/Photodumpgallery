import { useState, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { Button, Chip, Input } from "@heroui/react";

interface SkillsInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  maxSkills?: number;
  disabled?: boolean;
  placeholder?: string;
}

export function SkillsInput({
  skills,
  onChange,
  maxSkills = 20,
  disabled = false,
  placeholder = "Add a skill...",
}: SkillsInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addSkill = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (skills.length >= maxSkills) return;
    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setInputValue("");
      return;
    }

    onChange([...skills, trimmed]);
    setInputValue("");
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
    if (e.key === "Backspace" && !inputValue && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Skills list */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Chip key={skill} size="sm">
              {skill}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`Remove ${skill}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Chip>
          ))}
        </div>
      )}

      {/* Input */}
      {!disabled && skills.length < maxSkills && (
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1"
            maxLength={50}
          />
          <Button
            type="button"
            variant="outline"
            isIconOnly
            size="sm"
            onPress={addSkill}
            isDisabled={disabled || !inputValue.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Counter */}
      <p className="text-xs text-muted-foreground">
        {skills.length} / {maxSkills} skills
        {skills.length < maxSkills && " • Press Enter to add"}
      </p>
    </div>
  );
}
