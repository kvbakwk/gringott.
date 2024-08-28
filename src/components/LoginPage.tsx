'use client'

export default function LoginPage() {

  const handleSubmit = (formData: FormData) => {
    const email = formData.get('email');
    const password = formData.get('password');
    console.log(email, password);
  }

  return (
    <div>
      <form action={handleSubmit}>
        <input type="text" name="email" id="email" />
        <input type="password" name="password" id="password" />
        <input type="submit" value="zaloguj się" />
      </form>
    </div>
  );
}
