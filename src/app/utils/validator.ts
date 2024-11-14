export const validateWalletName = (name: string): boolean => {
  const pattern = /^.{1,256}$/;
  return pattern.test(name);
}

export const validateWalletBalance = (balance: string): boolean => {
  const pattern = /^\d+(?:.\d{1,2})?$/;
  return pattern.test(balance);
}

export const validateFullname = (fullname: string): boolean => {
  const pattern =
    /[A-ZŻŹĆĄŚĘŁÓŃ][A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+\s[A-ZŻŹĆĄŚĘŁÓŃ][A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ]+/;
  return pattern.test(fullname);
};

export const validateEmail = (email: string): boolean => {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
};

export const validatePassword = (password: string): boolean => {
  const pattern = /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9@$!%*#?&]{8,}$/;
  return pattern.test(password);
};

export const validatePasswords = (
  password1: string,
  password2: string
): boolean => {
  return password1 == password2;
};

export const validateTransactionDate = (date: string): boolean => {
  const pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
  return pattern.test(date);
}

export const validateTransactionAmount = (amount: string): boolean => {
  const pattern = /^\d+(?:.\d{1,2})?$/;
  return pattern.test(amount);
}

export const validateTransactionDescription = (description: string): boolean => {
  const pattern = /^.{1,256}$/;
  return pattern.test(description);
}

export const validateTransactionCategory = (category: string): boolean => {
  const category_ids = [1, 2, 3, 4, 5];
  return category_ids.includes(parseInt(category));
}

export const validateTransactionReceiver = (receiver: string): boolean => {
  const pattern = /^.{1,256}$/;
  return pattern.test(receiver);
}
