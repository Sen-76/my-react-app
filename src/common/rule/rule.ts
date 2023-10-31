import { Rule } from 'antd/es/form';
import { useTranslation } from 'react-i18next';

export const useRule = () => {
  const { t } = useTranslation();
  const createRequiredRule = (required?: boolean, allowSpace?: boolean, pass?: boolean, message?: string): Rule => {
    if (pass) return {};
    const defaultRequired = required ?? true;
    const defaultAllowSpace = allowSpace ?? false;
    const defaultMessage = message ?? t('Common_Require_Field');
    return {
      validator: (_rule: A, value: A) => {
        const valueType = typeof value;
        let result = false;
        switch (valueType) {
          case 'boolean':
            result = true;
            break;
          case 'number':
            result = true;
            break;
          case 'string': {
            if (defaultAllowSpace) {
              result = Boolean(value);
            } else {
              result = value && Boolean(value?.trim());
            }
            break;
          }
          case 'object':
            if (Array.isArray(value) && value.length > 0) {
              result = true;
            }
            if (value && !Array.isArray(value)) {
              result = true;
            }
            break;
          default:
            if (value) {
              result = true;
            }
            break;
        }
        if (value === undefined || value === null || Number.isNaN(value)) {
          result = false;
        }
        if (result || !defaultRequired) {
          return Promise.resolve();
        } else {
          return Promise.reject(new Error(defaultMessage));
        }
      },
      required: required
    };
  };
  return {
    createRequiredRule
  };
};
