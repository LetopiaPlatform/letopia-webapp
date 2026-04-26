import type { CreateCommunityFormData } from '@/lib/validators';
import { useCallback, useState } from 'react';
import type { UseFormSetValue, UseFormTrigger } from 'react-hook-form';

interface UseRulesManagementProps {
  rules: string[] | undefined;
  setValue: UseFormSetValue<CreateCommunityFormData>;
  trigger: UseFormTrigger<CreateCommunityFormData>;
}

interface UseRulesManagementReturn {
  newRule: string;
  setNewRule: (value: string) => void;
  editingIndex: number | null;
  addRule: () => void;
  editRule: (index: number) => void;
  removeRule: (index: number) => void;
}

const MAX_RULES = 20;

export function useRulesManagement({
  rules,
  setValue,
  trigger,
}: UseRulesManagementProps): UseRulesManagementReturn {
  const [newRule, setNewRule] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addRule = useCallback(() => {
    if (!newRule.trim()) return;

    const currentRules = rules || [];

    if (editingIndex !== null) {
      const updatedRules = [...currentRules];
      updatedRules[editingIndex] = newRule;
      setValue('rules', updatedRules);
      setEditingIndex(null);
    } else {
      if (currentRules.length < MAX_RULES) {
        setValue('rules', [...currentRules, newRule]);
      }
    }

    setNewRule('');
    trigger('rules');
  }, [newRule, rules, editingIndex, setValue, trigger]);

  const editRule = useCallback(
    (index: number) => {
      const currentRules = rules || [];
      setNewRule(currentRules[index]);
      setEditingIndex(index);
    },
    [rules]
  );

  const removeRule = useCallback(
    (index: number) => {
      const currentRules = rules || [];
      setValue(
        'rules',
        currentRules.filter((_, i) => i !== index)
      );
      trigger('rules');
    },
    [rules, setValue, trigger]
  );

  return {
    newRule,
    setNewRule,
    editingIndex,
    addRule,
    editRule,
    removeRule,
  };
}
