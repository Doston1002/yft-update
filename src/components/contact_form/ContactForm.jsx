import { useForm } from "react-hook-form";
import { useState } from "react";
import { Slide } from "react-awesome-reveal";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "react-i18next";

export const ContactForm = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const onRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const sendToTelegram = (data) => {
    if (!recaptchaToken) {
      alert("Please complete the reCAPTCHA challenge.");
      return;
    }

    const { fullName, phone, email, message } = data;

    const text = `
    <b>Yangi Murojaat:</b> \n
    <b>Ism:</b> ${fullName}\n
    <b>Telefon:</b> ${phone}\n
    <b>Email:</b> ${email}\n
    <b>Xabar:</b> ${message}
    `;

    const token = "7902713236:AAEMg0U-nt1v3plIOE5TloORgnWnRfBaIhs";
    const chat_id = "5531717864";

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chat_id,
        text: text,
        parse_mode: "HTML",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          alert("Your message was successfully sent to Telegram!");
          reset(); // Reset the form after submission
          window.location.reload();
        } else {
          alert("Error sending message to Telegram.");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Error occurred.");
      });
  };

  return (
    <div className="bg-white mb-10">
      <div className="container mx-auto w-[90%] flex justify-between lg:flex-row max-md:flex-col">
      <Slide className="w-1/2 max-md:w-full" direction="left">
        <div className="w-full">
          <form onSubmit={handleSubmit(sendToTelegram)} className="container h-[full] my-3">
            <div className="mx-auto w-[95%]">
              <h2 className="text-5xl font-bold text-[#0B2A5A] my-5" id="contactus">
                {t("Header.ContactUs")}
              </h2>

              {/* Full Name */}
              <div className="mb-4">
                <input
                  type="text"
                  {...register("fullName", { required: "Name is required" })}
                  className={`px-3 py-2 bg-[#FFF] border ${errors.fullName ? 'border-red-500' : 'border-[#082A58]'} shadow-sm placeholder-[#082A58] focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1`}
                  placeholder={t("contact.name")}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
              </div>

              {/* Phone */}
              <div className="mb-4">
                <input
                  type="number"
                  {...register("phone", { required: "Phone number is required" })}
                  className={`px-3 py-2 bg-[#FFF] border ${errors.phone ? 'border-red-500' : 'border-[#082A58]'} shadow-sm placeholder-[#082A58] focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1`}
                  placeholder="+(998) --- -- -- "
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              {/* Email */}
              <div className="mb-4">
                <input
                  type="email"
                  {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } })}
                  className={`px-3 py-2 bg-[#FFF] border ${errors.email ? 'border-red-500' : 'border-[#082A58]'} shadow-sm placeholder-[#082A58] focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1`}
                  placeholder="Email"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Message */}
              <div className="mb-4">
                <textarea
                  {...register("message", { required: "Message is required", minLength: { value: 20, message: "Message must be at least 20 characters" } })}
                  className={`px-3 py-2 bg-[#FFF] border ${errors.message ? 'border-red-500' : 'border-[#082A58]'} shadow-sm placeholder-[#082A58] focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1`}
                  placeholder="Your message"
                  rows="6"
                ></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>

              {/* reCAPTCHA */}
              <div className="mb-5">
                <ReCAPTCHA
                  sitekey="6LeHa2YqAAAAAFXoVnUu_8M9Xvy6GnILmHd6ySa9"
                  onChange={onRecaptchaChange}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="rounded bg-[#EEAD0F] px-10 py-3 text-white my-5 text-xs font-medium uppercase leading-tight shadow-md transition duration-150 ease-in-out hover:bg-[#d89d0b] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#082A58] focus:ring-offset-2"
              >
                {t("contact.send")}
              </button>
            </div>
          </form>
        </div>
        </Slide>

<iframe
  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1181.1895909939317!2d69.21878063797728!3d41.2875452257138!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8be0fdfbfecd%3A0x6c5afd84eb8438a6!2sLLC%20%22YANGIYER%20FLOUR%20TRADING%22!5e0!3m2!1suz!2s!4v1684500868007!5m2!1suz!2s"
  width="600"
  height="450"
  allowFullScreen=""
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
></iframe>
      </div>
    </div>
  );
};
