import { FC, MouseEvent, useEffect, useMemo } from 'react';
import { SetLocationValueDispatch, ValidationResult } from '@uniformdev/mesh-sdk-react';
import CalloutNonThemeSelected from './CalloutNonThemeSelected';
import { Theme } from '../../types/common';
import { TRUE_VALIDATION_RESULT } from '../../constants';

const validate = (value?: string): ValidationResult => {
  if (!value) {
    return {
      isValid: false,
      validationMessage: 'The Color Style must be selected',
    };
  }
  return TRUE_VALIDATION_RESULT;
};

type ColorStyleParamProps = {
  value?: string;
  selectedTheme?: Theme;
  setValue: SetLocationValueDispatch<string | undefined, string | undefined>;
  required?: boolean;
};

const ColorStyleParam: FC<ColorStyleParamProps> = ({ value, setValue, selectedTheme, required = false }) => {
  useEffect(
    () => {
      if (!required) return;

      setValue((previousValue) => ({
        newValue: previousValue,
        options: validate(previousValue),
      }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const availableItems = useMemo(
    () => selectedTheme?.colors?.filter?.((i) => !i.name.includes('-') || i.name.includes('base')) || [],
    [selectedTheme?.colors]
  );

  const handelSaveValue = (e: MouseEvent<HTMLButtonElement>) => {
    const { name: currentValue } = (e.target as HTMLButtonElement) || {};
    setValue(() => {
      const newValue = currentValue === value ? undefined : currentValue;
      return {
        newValue,
        options: required ? validate(newValue) : undefined,
      };
    });
  };

  if (!selectedTheme?.themeName) return <CalloutNonThemeSelected />;
  return (
    <div className="button-style-container">
      {availableItems.map((item, index) => (
        <button
          key={`${item.value}-${index}`}
          className={`style-item ${item.name === value ? 'style-item-selected' : ''}`}
          name={item.name}
          title={item.label}
          style={{ background: item.value }}
          onClick={handelSaveValue}
        />
      ))}
    </div>
  );
};

export default ColorStyleParam;
