export default function LoginPage() {
  return (
    <div>
      <form>
        <input type="text" name="email" id="email" /> <br />
        <input type="password" name="password" id="password" /> <br />
        <input type="password" name="password2" id="password2" /> <br />
        <input type="text" name="name" id="name" /> <br />
        <input type="text" name="surname" id="surname" /> <br />
        <input type="checkbox" name="policy" id="policy" /> <br />
        <label htmlFor="policy">regulamin</label>
        <input type="submit" value="zarejestruj się" /> <br />
      </form>
    </div>
  );
}
