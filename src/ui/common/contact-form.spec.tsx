import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { contactFormSchema } from "./contact-form.schema";

afterEach(() => {
  cleanup();
});

let submitSpy: ReturnType<typeof mock.fn>;

beforeEach(() => {
  submitSpy = mock.fn((data: unknown) => data);
});

mock.module("@web3forms/react", {
  defaultExport: (options?: { onSuccess?: (msg: string, data: unknown) => void }) => ({
    submit: (data: unknown) => {
      submitSpy(data);
      options?.onSuccess?.("Email sent successfully", data);
    },
  }),
});

const renderContactForm = async () => {
  const { default: ContactForm } = await import("./contact-form");
  const ContactFormWrapper = () => {
    const methods = useForm({
      resolver: yupResolver(contactFormSchema),
      mode: "onChange",
    });

    return (
      <FormProvider {...methods}>
        <ContactForm />
      </FormProvider>
    );
  };

  render(<ContactFormWrapper />);

  return { submitSpy };
};

test("displays validation errors when inputs are empty", async () => {
  await renderContactForm();

  const submitButton = screen.getByRole("button", { name: /wysłać/i });
  fireEvent.click(submitButton);

  assert.ok(await screen.findByText("Imię jest wymagane"));
  assert.ok(await screen.findByText("Email jest wymagany"));
  assert.ok(await screen.findByText("Numer telefonu jest wymagany"));
  assert.ok(await screen.findByText("Wiadomość musi mieć co najmniej 4 znaków"));
});

test("renders contact form fields and submit button", async () => {
  await renderContactForm();

  assert.ok(screen.getByPlaceholderText("Podaj imię..."));
  assert.ok(screen.getByPlaceholderText("Podaj email..."));
  assert.ok(screen.getByPlaceholderText("Podaj numer telefonu..."));
  assert.ok(screen.getByPlaceholderText("Informacje dla nas..."));
  assert.ok(screen.getByRole("button", { name: /wysłać/i }));
});

test("submits the form successfully without sending email", async () => {
  const { submitSpy } = await renderContactForm();

  fireEvent.change(screen.getByPlaceholderText("Podaj imię..."), {
    target: { value: "John Doe" },
  });
  fireEvent.change(screen.getByPlaceholderText("Podaj email..."), {
    target: { value: "raman.mastyka@gmail.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("Podaj numer telefonu..."), {
    target: { value: "123456789" },
  });
  fireEvent.change(screen.getByPlaceholderText("Informacje dla nas..."), {
    target: { value: "This is a test message." },
  });

  const submitButton = screen.getByRole("button", { name: /wysłać/i });
  fireEvent.click(submitButton);

  await waitFor(() =>
    assert.ok(screen.getByText("Dziękujemy! Formularz został pomyślnie wysłany."))
  );
  assert.equal(submitSpy.mock.calls.length, 1);
});
