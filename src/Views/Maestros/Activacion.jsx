import React, {useState} from 'react';
import Gestion_grupos_estudiantes from './Gestion_grupos_estudiantes';
import {AlertCircle, ArrowLeft, ArrowRight, Check, KeyRound, Loader2, Lock, Mail} from "lucide-react";
import {toast} from "sonner";

// Diccionario de traducciones completo (ES, EN, PT, FR)
const translations = {
  es: {
    title: "Activación de Cuenta",
    codeLabel: "Código de activación",
    codePlaceholder: "Ingrese su código",
    verify: "Verificar código",
    forgotPass: "¿Olvidó su contraseña?",
    newAct: "Información",
    infoText: "El desafío Bebras es un concurso internacional diseñado para promover la informática y el pensamiento computacional entre los estudiantes. Tenga en cuenta que las categorías Bebras son: Super Peque-1ro y 2do grado, Peque-3ro y 4to grado, Benjamin-5to y 6to grado, Cadete-7mo y 8vo grado, Junior-9no y 10mo grado y Senior-11no y 12mo grado",
    back: "Volver",
    next: "Siguiente",
    accountData: "Datos de cuenta",
    emailPlaceholder: "Correo electrónico",
    passPlaceholder: "Contraseña",
    termsTitle: "Términos y Condiciones",
    termsText: "Esta plataforma es un sistema de gestión basado en ejercicios y una herramienta de análisis de aprendizaje. El sistema ofrece la posibilidad de compartir y crear cursos, ejercicios electrónicos y otros recursos didácticos. Los estudiantes pueden usarla realizando su propio trabajo o respondiendo preguntas evaluadas automáticamente por la plataforma o el profesor.",
    termText2: "El servicio consta de tres grupos principales de usuarios: profesores, estudiantes y coordinador nacional. El coordinador nacional es el responsable de la creación del desafío. El grupo 'profesores' está formado por todos los usuarios con una cuenta de profesor en el sistema. Los estudiantes pueden usar el sistema a través de cursos creados por su profesor",
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
    infoText: "The Bebras challenge is an international contest designed to promote logic and computational thinking among students. Please, note that the Bebras levels are: Super Peque-1st and 2nd grade, Peque-3rd and 4th grade, Benjamin-5th and 6th grade, Cadete-7th and 8th grade, Junior-9th and 10th grade and Senior-11th and 12th grade",
    back: "Back",
    next: "Next",
    accountData: "Account details",
    emailPlaceholder: "Email address",
    passPlaceholder: "Password",
    termsTitle: "Terms and Conditions",
    termsText: "This platform is a management system based in tasks and learning analysis. The system offer possibilities like sharing and creating courses, electronic tasks and others didactic resources. Students can use it making its own work or answering automatic evaluated questions by the platform or by the teacher ",
    termsText2: "This service has three users groups: teachers, students and national coordinator. National Coordinator is creating challenge responsible. Professors group is made by all users with an professor account in the system. Students can use the system through created courses by its teacher",
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
  },
  pt: {
    title: "Ativação de Conta",
    codeLabel: "Código de ativação",
    codePlaceholder: "Digite seu código",
    verify: "Verificar código",
    forgotPass: "Esqueceu sua senha?",
    newAct: "Informação",
    infoText: "O desafio Bebras é uma competição internacional projetada para promover a informática e o pensamento computacional entre os estudantes. Observe que as categorias Bebras são: Super Peque-1º e 2º ano, Peque-3º e 4º ano, Benjamin-5º e 6º ano, Cadete-7º e 8º ano, Junior-9º e 10º ano e Senior-11º e 12º ano",
    back: "Voltar",
    next: "Próximo",
    accountData: "Dados da conta",
    emailPlaceholder: "E-mail",
    passPlaceholder: "Senha",
    termsTitle: "Termos e Condições",
    termsText: "Esta plataforma é um sistema de gestão baseado em exercícios e uma ferramenta de análise de aprendizagem. O sistema oferece a possibilidade de compartilhar e criar cursos, exercícios eletrônicos e outros recursos didáticos. Os estudantes podem usá-la realizando seu próprio trabalho ou respondendo perguntas avaliadas automaticamente pela plataforma ou pelo professor.",
    termText2: "O serviço possui três grupos principais de usuários: professores, estudantes e coordenador nacional. O coordenador nacional é o responsável pela criação do desafio. O grupo 'professores' é formado por todos os usuários com uma conta de professor no sistema. Os estudantes podem usar o sistema através de cursos criados por seu professor",
    acceptTerms: "Aceito os termos e condições",
    confirmTitle: "Confirmação final",
    acceptEmails: "Aceito receber e-mails informativos",
    activate: "Ativar conta",
    successVerify: "Código verificado com sucesso",
    errorVerify: "Código de ativação incorreto",
    errorFields: "Preencha todos os campos obrigatórios",
    errorTerms: "Você deve aceitar os termos para continuar",
    successAct: "Conta ativada com sucesso!",
    successReset: "Link de recuperação enviado ao e-mail",
    promptEmail: "Por favor, insira seu e-mail para recuperar sua senha:"
  },
  fr: {
    title: "Activation du compte",
    codeLabel: "Code d'activation",
    codePlaceholder: "Entrez votre code",
    verify: "Vérifier le code",
    forgotPass: "Mot de passe oublié ?",
    newAct: "Information",
    infoText: "Le défi Bebras est un concours international conçu pour promouvoir l'informatique et la pensée computationnelle chez les élèves. Veuillez noter que les catégories Bebras sont : Super Peque - 1re et 2e année, Peque - 3e et 4e année, Benjamin - 5e et 6e année, Cadete - 7e et 8e année, Junior - 9e et 10e année, Senior - 11e et 12e année",
    back: "Retour",
    next: "Suivant",
    accountData: "Données du compte",
    emailPlaceholder: "Adresse e-mail",
    passPlaceholder: "Mot de passe",
    termsTitle: "Conditions générales",
    termsText: "Cette plateforme est un système de gestion basé sur des exercices et un outil d'analyse de l'apprentissage. Le système offre la possibilité de partager et de créer des cours, des exercices électroniques et d'autres ressources didactiques. Les élèves peuvent l'utiliser en effectuant leur propre travail ou en répondant à des questions évaluées automatiquement par la plateforme ou par l'enseignant.",
    termText2: "Le service comprend trois groupes principaux d'utilisateurs : les enseignants, les élèves et le coordinateur national. Le coordinateur national est responsable de la création du défi. Le groupe « enseignants » est composé de tous les utilisateurs disposant d'un compte enseignant dans le système. Les élèves peuvent utiliser le système via des cours créés par leur enseignant",
    acceptTerms: "J'accepte les conditions générales",
    confirmTitle: "Confirmation finale",
    acceptEmails: "J'accepte de recevoir des e-mails informatifs",
    activate: "Activer le compte",
    successVerify: "Code vérifié avec succès",
    errorVerify: "Code d'activation incorrect",
    errorFields: "Veuillez remplir tous les champs obligatoires",
    errorTerms: "Vous devez accepter les conditions pour continuer",
    successAct: "Compte activé avec succès !",
    successReset: "Lien de récupération envoyé par e-mail",
    promptEmail: "Veuillez saisir votre e-mail pour récupérer votre mot de passe :"
  }
};

const Activacion = ({onActivate, onResetPassword, onSuccess}) => {
  const [language, setLanguage] = useState('es');
  const t = translations[language];

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
    const enteredCode = formData.activationCode.trim().toUpperCase();
    if (!enteredCode) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Obtener la clave guardada por el coordinador nacional
      const savedKey = localStorage.getItem('bebrasAccessKey');

      // SOLO verificar si el código ingresado coincide EXACTAMENTE con el generado por el coordinador
      if (savedKey && enteredCode === savedKey) {
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
          className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-sky-100 p-4 font-sans">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 relative animate-[fadeInUp_.4s_ease-out]">

          {/* Selector de Idioma con PT y FR */}
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
            <button
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    language === "pt" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
                onClick={() => setLanguage("pt")}
            >
              PT
            </button>
            <button
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    language === "fr" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
                onClick={() => setLanguage("fr")}
            >
              FR
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
                    {t.termText2}
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

          {/* Botones de navegación */}
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