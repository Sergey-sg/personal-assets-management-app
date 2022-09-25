const PASSWORD_RULE = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

const FILE_TYPE_RULE = /[\/.](webp|jpg|jpeg|svg|png)$/i;

const PASSWORD_RULE_MESSAGE =
  'The password must contain uppercase and lowercase letters';

const FILE_TYPE_RULE_MESSAGE =
  'The file must be in the format webp, jpg, jpeg, svg, png';

export const REGEX = {
  PASSWORD_RULE,
  FILE_TYPE_RULE,
};

export const MESSAGES = {
  PASSWORD_RULE_MESSAGE,
  FILE_TYPE_RULE_MESSAGE,
};
