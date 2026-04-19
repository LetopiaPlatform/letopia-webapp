import { useRef, useEffect } from 'react';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  disabled?: boolean;
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  onSubmit,
  disabled = false,
}: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, char: string) => {
    // Only allow digits
    if (char && !/^\d$/.test(char)) return;

    const arr = value.split('');
    arr[index] = char;
    const newValue = arr.join('').slice(0, length);
    onChange(newValue);

    // Auto-focus next input
    if (char && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // Move to previous input on empty backspace
        inputsRef.current[index - 1]?.focus();
        const arr = value.split('');
        arr[index - 1] = '';
        onChange(arr.join(''));
      } else {
        const arr = value.split('');
        arr[index] = '';
        onChange(arr.join(''));
      }
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    } else if (e.key === 'Enter' && onSubmit && value.length === length) {
      onSubmit();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted);
    // Focus the input after the last pasted digit
    const focusIndex = Math.min(pasted.length, length - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  return (
    <div className="flex h-[70px] w-full items-center justify-center gap-2 sm:gap-4">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={value[index] ?? ''}
          onChange={(el) => handleChange(index, el.target.value)}
          onKeyDown={(el) => handleKeyDown(index, el)}
          onPaste={index === 0 ? handlePaste : undefined}
          disabled={disabled}
          className="h-[52px] w-[44px] sm:h-[65px] sm:w-[60px] rounded-lg border-2 border-[#24252C] bg-transparent text-center text-xl sm:text-2xl font-semibold text-[#24252C] outline-none transition-colors focus:border-[#824892] disabled:opacity-50"
        />
      ))}
    </div>
  );
}
