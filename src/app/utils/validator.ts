export const validateEmail = (email: string): boolean => {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
};

export const validatePassword = (password: string): boolean => {
  const pattern = /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9@$!%*#?&]{8,}$/;
  return pattern.test(password);
};
