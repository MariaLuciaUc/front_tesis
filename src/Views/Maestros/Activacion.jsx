import React, {useState} from 'react';
import Gestion_grupos_estudiantes from './Gestion_grupos_estudiantes';
import {AlertCircle, ArrowLeft, ArrowRight, Check, KeyRound, Loader2, Lock, Mail} from "lucide-react";
import {toast} from "sonner";

// 1. Diccionario de traducciones
const translations = {
  es: {
    title: "Activación de Cuenta",
    codeLabel: "Código de activación",
    codePlaceholder: "Ingrese su código",
    verify: "Verificar código",
    forgotPass: "¿Olvidó su contraseña?",
    newAct: "Información",
    infoText: "El desafío Bebras es un concurso internacional de pensamiento computacional diseñado para promover la informática y el pensamiento cumputacional entre los estudiantes. Tenga en cuenta que las categorías Bebras son: Super Peque-1ro y 2do grado, Peque-3ro y 4to grado, Benjamin-5to y 6to grado, Cadete-7mo y 8vo grado, Junior-9no y 10mo grado y Senior-11no y 12mo grado",
    back: "Volver",
    next: "Siguiente",
    accountData: "Datos de cuenta",
    emailPlaceholder: "Correo electrónico",
    passPlaceholder: "Contraseña",
    termsTitle: "Términos y Condiciones",
    termsText: "Por favor, lea atentamente los términos de servicio antes de continuar con la activación de su cuenta en la plataforma...",
    acceptTerms: "Acepto los términos y condiciones",
    confirmTitle: "Confirmación final",
    acceptEmails: "Acepto recibir correos informativos",
    activate: "Activar cuenta",
    successVerify: "Código verificado correctamente",
    errorVerify: "Código de activación incorrecto",
    errorFields: "Complete todos los campos requeridos",
    errorTerms: "Debe aceptar los términos para continuar",
    successAct: "¡Cuenta activada con éxito!",
    successReset: "Enlace de recuperación enviado al correo",
    promptEmail: "Por favor, ingrese su correo electrónico para recuperar la contraseña:"
  },
  en: {
    title: "Account Activation",
    codeLabel: "Activation code",
    codePlaceholder: "Enter your code",
    verify: "Verify code",
    forgotPass: "Forgot your password?",
    newAct: "Information",
    infoText: "The Bebras challenge is an international computational thinking contest designed to promote logic and computational thinking among students. Please, note that the Bebras levels are: Super Peque-1st and 2nd grade, Peque-3rd and 4th grade, Benjamin-5th and 6th grade, Cadete-7th and 8th grade, Junior-9th and 10th grade and Senior-11th and 12th grade",
    back: "Back",
    next: "Next",
    accountData: "Account details",
    emailPlaceholder: "Email address",
    passPlaceholder: "Password",
    termsTitle: "Terms and Conditions",
    termsText: "Please read the terms of service carefully before proceeding with the activation of your account on the platform...",
    acceptTerms: "I accept the terms and conditions",
    confirmTitle: "Final confirmation",
    acceptEmails: "I agree to receive informational emails",
    activate: "Activate account",
    successVerify: "Code verified successfully",
    errorVerify: "Invalid activation code",
    errorFields: "Please fill in all required fields",
    errorTerms: "You must accept the terms to continue",
    successAct: "Account activated successfully!",
    successReset: "Recovery link sent to email",
    promptEmail: "Please enter your email to recover your password:"
  }
};

const Activacion = ({onActivate, onResetPassword, onSuccess}) => {
  const [language, setLanguage] = useState('es');
  const t = translations[language]; // Hook de traducción manual

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const [formData, setFormData] = useState({
    activationCode: '',
    email: '',
    password: '',
    acceptedTerms: false,
    acceptedEmails: false,
  });

  const updateForm = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const handleVerifyCode = async () => {
    if (!formData.activationCode.trim()) return;

    setIsLoading(true);
    // Simulamos una llamada a la API
    setTimeout(() => {
      setIsLoading(false);
      if (formData.activationCode === 'BEBRASCUBA112025') {
        toast.success(t.successVerify);
        setStep(2);
      } else {
        toast.error(t.errorVerify);
      }
    }, 800);
  };

  const handleNextStep = async () => {
    if (step === 3 && (!formData.email || !formData.password)) {
      toast.error(t.errorFields);
      return;
    }
    if (step === 4 && !formData.acceptedTerms) {
      toast.warning(t.errorTerms);
      return;
    }
    if (step === 5) {
      setIsLoading(true);
      // Simulamos la activación final
      setTimeout(() => {
        setIsLoading(false);
        if (onActivate) onActivate(formData);
        toast.success(t.successAct);
        if (onSuccess) onSuccess();
        setShowDashboard(true);
      }, 1000);
      return;
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const handleForgotPassword = () => {
    const userEmail = window.prompt(t.promptEmail);
    if (userEmail) {
      if (onResetPassword) onResetPassword(userEmail);
      toast.success(t.successReset);
    }
  };

  if (showDashboard) {
    return <Gestion_grupos_estudiantes/>;
  }

  // Componente visual de pasos (Stepper)
  const renderStepper = () => (
    <div className="flex items-center justify-center mb-8 space-x-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <React.Fragment key={i}>
          <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-colors ${
            step === i ? 'bg-blue-600 text-white shadow-md' :
              step > i ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-400'
          }`}>
            {step > i ? <Check size={16}/> : i}
          </div>
          {i < 5 && (
            <div className={`w-8 h-1 rounded ${step > i ? 'bg-blue-500' : 'bg-slate-200'}`}/>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-sky-100 p-4 font-sans">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 relative animate-[fadeInUp_.4s_ease-out]">

        {/* Selector de Idioma */}
        <div className="absolute top-4 right-4 flex gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
          <button
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              language === "es" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => setLanguage("es")}
          >
            ES
          </button>
          <button
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              language === "en" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => setLanguage("en")}
          >
            EN
          </button>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-800 text-center mt-4 mb-6">
          {t.title}
        </h2>

        {renderStepper()}

        <div className="min-h-[220px]">
          {/* PASO 1: Código */}
          {step === 1 && (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700">
                {t.codeLabel}
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                <input
                  type="text"
                  value={formData.activationCode}
                  onChange={(e) => updateForm('activationCode', e.target.value.toUpperCase())}
                  placeholder={t.codePlaceholder}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyCode()}
                />
              </div>
              <button
                onClick={handleVerifyCode}
                disabled={!formData.activationCode || isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20}/> : <Check size={20}/>}
                {t.verify}
              </button>
              <div className="text-center pt-2">
                <button
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                >
                  {t.forgotPass}
                </button>
              </div>
            </div>
          )}

          {/* PASO 2: Información */}
          {step === 2 && (
            <div className="space-y-4 animate-[fadeIn_.3s_ease-out]">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <AlertCircle className="text-blue-500" size={20}/>
                {t.newAct}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed bg-blue-50 p-4 rounded-xl border border-blue-100">
                {t.infoText}
              </p>
            </div>
          )}

          {/* PASO 3: Credenciales */}
          {step === 3 && (
            <div className="space-y-4 animate-[fadeIn_.3s_ease-out]">
              <h3 className="text-lg font-bold text-slate-800">{t.accountData}</h3>
              <div className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateForm('password', e.target.value)}
                    placeholder={t.passPlaceholder}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASO 4: Términos */}
          {step === 4 && (
            <div className="space-y-4 animate-[fadeIn_.3s_ease-out]">
              <h3 className="text-lg font-bold text-slate-800">{t.termsTitle}</h3>
              <div
                className="bg-slate-50 p-4 rounded-xl border border-slate-200 h-32 overflow-y-auto text-sm text-slate-600">
                {t.termsText}
                <br/>
                <br/>
                <br/>
              </div>
              <label
                className="flex items-center gap-3 mt-4 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  checked={formData.acceptedTerms}
                  onChange={(e) => updateForm('acceptedTerms', e.target.checked)}
                />
                <span className="text-sm font-medium text-slate-700">{t.acceptTerms}</span>
              </label>
            </div>
          )}

          {/* PASO 5: Confirmación */}
          {step === 5 && (
            <div className="space-y-4 animate-[fadeIn_.3s_ease-out]">
              <h3 className="text-lg font-bold text-slate-800">{t.confirmTitle}</h3>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
                <p className="text-sm text-slate-600">
                  <strong className="text-slate-800">Email:</strong> {formData.email}
                </p>
                <p className="text-sm text-slate-600">
                  <strong className="text-slate-800">Password:</strong> ••••••••
                </p>
              </div>
              <label
                className="flex items-center gap-3 mt-4 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  checked={formData.acceptedEmails}
                  onChange={(e) => updateForm('acceptedEmails', e.target.checked)}
                />
                <span className="text-sm font-medium text-slate-700">{t.acceptEmails}</span>
              </label>
            </div>
          )}
        </div>

        {/* Botones de navegación (Ocultos en el paso 1) */}
        {step > 1 && (
          <div className="flex justify-between mt-8 pt-4 border-t border-slate-100">
            <button
              onClick={handlePrevStep}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors disabled:opacity-50"
            >
              <ArrowLeft size={18}/> {t.back}
            </button>

            <button
              onClick={handleNextStep}
              disabled={isLoading || (step === 4 && !formData.acceptedTerms)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18}/>
              ) : step === 5 ? (
                <Check size={18}/>
              ) : (
                <ArrowRight size={18}/>
              )}
              {step === 5 ? t.activate : t.next}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Activacion;