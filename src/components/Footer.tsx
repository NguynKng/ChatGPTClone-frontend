export default function Footer() {
  return (
    <footer className="absolute bottom-0 w-full p-2 text-center text-sm text-white min-h-[4vh]">
      <p>
        {`By messaging ChatGPT, you agree to our `}
        <a
          href="https://openai.com/policies/terms-of-use"
          className="font-medium underline"
        >
          Terms
        </a>
        {` and have read our `}
        <a
          href="https://openai.com/policies/privacy-policy"
          className="font-medium underline"
        >
          Privacy Policy
        </a>
        .
      </p>
    </footer>
  );
}
