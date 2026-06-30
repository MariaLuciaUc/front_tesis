import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Send, CheckCircle, Edit3, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';

const translations = {
    es: {
        questionLabel: "Pregunta",
        instructions: "Instrucciones",
        statement: "",
        yourAnswer: "Tu respuesta",
        placeholder: "Escribe aquí tu respuesta...",
        send: "Enviar respuesta",
        answerSaved: "Respuesta guardada",
        previous: "Anterior",
        next: "Siguiente",
        dragToResize: "Arrastra para ajustar",
        difficulty: "Dificultad",
        selectOption: "Selecciona una opción",
        options: "Opciones",
        selectNumber: "Escribe el número:"
    },
    en: {
        questionLabel: "Question",
        instructions: "Instructions",
        statement: "",
        yourAnswer: "Your answer",
        placeholder: "Write your answer here...",
        send: "Submit answer",
        answerSaved: "Answer saved",
        previous: "Previous",
        next: "Next",
        dragToResize: "Drag to resize",
        difficulty: "Difficulty",
        selectOption: "Select an option",
        options: "Options",
        selectNumber: "Write the number:"
    },
    pt: {
        questionLabel: "Pergunta",
        instructions: "Instruções",
        statement: "",
        yourAnswer: "Sua resposta",
        placeholder: "Escreva sua resposta aqui...",
        send: "Enviar resposta",
        answerSaved: "Resposta salva",
        previous: "Anterior",
        next: "Próximo",
        dragToResize: "Arraste para ajustar",
        difficulty: "Dificuldade",
        selectOption: "Selecione uma opção",
        options: "Opções",
        selectNumber: "Escreva o número:"
    },
    fr: {
        questionLabel: "Question",
        instructions: "Instructions",
        statement: "",
        yourAnswer: "Votre réponse",
        placeholder: "Écrivez votre réponse ici...",
        send: "Envoyer la réponse",
        answerSaved: "Réponse enregistrée",
        previous: "Précédent",
        next: "Suivant",
        dragToResize: "Glisser pour ajuster",
        difficulty: "Difficulté",
        selectOption: "Sélectionnez une option",
        options: "Options",
        selectNumber: "Écrivez le nombre:"
    }
};

const Pregunta = ({
                      question,
                      questionNumber,
                      totalQuestions,
                      answer,
                      isSubmitted,
                      onAnswerChange,
                      onSubmit,
                      onPrevious,
                      onNext,
                      isFirst,
                      isLast,
                      language = 'es',
                      initialLeftWidth = 50,
                  }) => {
    const t = translations[language] || translations.es;
    const containerRef = useRef(null);
    const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        onAnswerChange(option);
    };

    const handleMouseDown = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleMouseMove = useCallback((e) => {
        if (!isDragging || !containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        const clampedWidth = Math.min(85, Math.max(15, newLeftWidth));
        setLeftWidth(clampedWidth);
    }, [isDragging]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const isImageOption = (option) => {
        if (typeof option === 'string') {
            return option.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i) !== null;
        }
        return false;
    };

    const getImagePath = (option) => {
        if (option.startsWith('/images/')) {
            return option;
        }
        return `/images/${option}`;
    };

    const isOptionImageFromQuestion = (option) => {
        if (!question.images) return false;
        return question.images.some(img =>
            img === option ||
            img === `/images/${option}` ||
            img.replace('/images/', '') === option
        );
    };

    const areAllOptionsImages = () => {
        if (!question.options || question.options.length === 0) return false;
        return question.options.every(opt => isImageOption(opt) || isOptionImageFromQuestion(opt));
    };

    const isImageAnOption = (img) => {
        if (!question.options) return false;
        // Si la imagen no tiene extensión, no es una opción de imagen
        if (!img.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
            return false;
        }
        return question.options.some(opt => {
            if (!isImageOption(opt)) {
                return false;
            }
            const cleanImg = img.replace(/\.(jpg|jpeg|png|gif|svg|webp)$/i, '').trim().toLowerCase();
            const cleanOpt = opt.replace(/\.(jpg|jpeg|png|gif|svg|webp)$/i, '').trim().toLowerCase();
            return opt === img ||
                opt === img.replace('/images/', '') ||
                img === `/images/${opt}` ||
                cleanImg === cleanOpt;
        });
    };

    const isOptionsImage = (img) => {
        if (typeof img !== 'string') return false;
        const lower = img.toLowerCase();
        return lower.includes('options') || lower.includes('opciones');
    };

    const getLetter = (index) => {
        return String.fromCharCode(65 + index); // 65 = 'A'
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full">
            <div
                ref={containerRef}
                className="flex relative h-full"
                style={{ height: 'calc(100vh - 120px)', minHeight: '500px' }}
            >
                <div
                    className="overflow-y-auto p-8"
                    style={{ width: `${leftWidth}%` }}
                >
                    <div className="max-w-none">
                        <div className="mb-6 pb-4 border-b border-slate-200">
                            <div className="flex justify-between items-start">
                                <h2 className="text-xl font-semibold text-blue-600 mb-1">
                                    {t.questionLabel} {questionNumber}
                                </h2>
                                {question.difficulty && (
                                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                        question.difficulty === 'Fácil' || question.difficulty === 'Facil' ? 'bg-green-100 text-green-700' :
                                            question.difficulty === 'Media' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                    }`}>
                                        {t.difficulty}: {question.difficulty}
                                    </span>
                                )}
                            </div>
                            <p className="text-slate-500 text-sm">
                                {questionNumber} / {totalQuestions}
                            </p>
                        </div>

                        {question.title && (
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                {question.title}
                            </h3>
                        )}

                        <div className="mb-6">
                            <div className="prose prose-slate max-w-none">
                                <p className="text-slate-800 text-lg leading-relaxed whitespace-pre-wrap">
                                    {question.question || question.text || question.description}
                                </p>
                            </div>
                        </div>

                        {question.instructions && (
                            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <p className="text-blue-800 text-sm leading-relaxed whitespace-pre-wrap">
                                    {question.instructions}
                                </p>
                            </div>
                        )}

                        {question.images && question.images.length > 0 && (
                            <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <div className="flex flex-wrap gap-6 justify-center">
                                    {question.images.map((img, idx) => {
                                        const isOptionImage = isImageAnOption(img);

                                        if (isOptionImage) {
                                            return null;
                                        }

                                        const hasExtension = img.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i);
                                        if (!hasExtension) {
                                            return null;
                                        }

                                        const isOptionsImg = isOptionsImage(img);

                                        return (
                                            <div key={idx} className="flex flex-col items-center">
                                                <img
                                                    src={img.startsWith('/') ? img : `/images/${img}`}
                                                    alt=""
                                                    className="max-w-full max-h-72 object-contain rounded-lg shadow-md"
                                                    onError={(e) => {
                                                        e.target.src = '/images/placeholder.png';
                                                        e.target.alt = 'Imagen no disponible';
                                                    }}
                                                />
                                                {isOptionsImg && (
                                                    <div className="flex justify-center gap-8 mt-2 w-full">
                                                        {['A', 'B', 'C', 'D'].map((letter, i) => (
                                                            <span key={i} className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                                                                {letter}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div
                    className={`relative w-2 cursor-col-resize bg-slate-200 hover:bg-blue-400 transition-colors flex-shrink-0 ${
                        isDragging ? 'bg-blue-500' : ''
                    }`}
                    onMouseDown={handleMouseDown}
                    style={{ cursor: 'col-resize' }}
                >
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-white rounded-full p-1 shadow-md">
                            <GripVertical size={16} className="text-slate-400" />
                        </div>
                    </div>
                </div>

                <div
                    className="overflow-y-auto p-8 bg-slate-50"
                    style={{ width: `${100 - leftWidth}%` }}
                >
                    <div className="h-full flex flex-col">
                        <div className="mb-4 pb-3 border-b border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                                <Edit3 size={18} /> {t.yourAnswer}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                {isSubmitted ? t.answerSaved : "Selecciona o escribe tu respuesta"}
                            </p>
                        </div>

                        <div className="flex-1 flex flex-col gap-4">
                            {question.type === 'numeric' ? (
                                <div className="flex-1 flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm text-slate-600 font-medium">
                                            {t.selectNumber}
                                        </label>
                                        <input
                                            type="number"
                                            value={answer || ''}
                                            onChange={(e) => onAnswerChange(e.target.value)}
                                            placeholder="Escribe el número aquí..."
                                            className="w-full max-w-xs px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg"
                                            min="0"
                                            max="999"
                                        />
                                    </div>
                                    <button
                                        onClick={onSubmit}
                                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-md max-w-xs"
                                    >
                                        <Send size={18} /> {t.send}
                                    </button>
                                    {isSubmitted && (
                                        <span className="flex items-center gap-1 text-sm text-green-600 animate-in fade-in duration-300">
                                            <CheckCircle size={14} /> {t.answerSaved}
                                        </span>
                                    )}
                                </div>
                            ) : question.type === 'text' || question.type === 'open' ? (
                                <div className="flex-1 flex flex-col gap-3">
                                    <textarea
                                        value={answer || ''}
                                        onChange={(e) => onAnswerChange(e.target.value)}
                                        placeholder={t.placeholder}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                        style={{ minHeight: '120px', maxHeight: '200px' }}
                                    />
                                    <button
                                        onClick={onSubmit}
                                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-md"
                                    >
                                        <Send size={18} /> {t.send}
                                    </button>
                                    {isSubmitted && (
                                        <span className="flex items-center gap-1 text-sm text-green-600 animate-in fade-in duration-300">
                                            <CheckCircle size={14} /> {t.answerSaved}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <div className="flex-1">
                                    <p className="text-sm text-slate-500 mb-3">
                                        {areAllOptionsImages() ? "Haz clic en la imagen que creas correcta" : t.selectOption}
                                    </p>
                                    <div className={`grid ${areAllOptionsImages() ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'} gap-4`}>
                                        {question.options && question.options.map((option, idx) => {
                                            const isImage = isImageOption(option);
                                            const isSelected = answer === option || selectedOption === option;
                                            const isOptionImg = isOptionImageFromQuestion(option);
                                            const isAllImages = areAllOptionsImages();
                                            const letter = getLetter(idx);

                                            if (isAllImages) {
                                                return (
                                                    <div
                                                        key={idx}
                                                        onClick={() => handleOptionSelect(option)}
                                                        className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all transform hover:scale-105 ${
                                                            isSelected
                                                                ? 'ring-4 ring-blue-500 shadow-xl scale-105'
                                                                : 'ring-2 ring-transparent hover:ring-blue-300 shadow-md'
                                                        }`}
                                                    >
                                                        <img
                                                            src={getImagePath(option)}
                                                            alt={`Opción ${letter}`}
                                                            className="w-full h-auto object-contain bg-white"
                                                            style={{ maxHeight: '150px' }}
                                                            onError={(e) => {
                                                                e.target.src = '/images/placeholder.png';
                                                                e.target.alt = `Opción ${letter}`;
                                                            }}
                                                        />
                                                        {isSelected && (
                                                            <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1 shadow-lg">
                                                                <CheckCircle size={16} className="text-white" />
                                                            </div>
                                                        )}
                                                        <div className={`text-center py-1.5 text-sm font-bold ${
                                                            isSelected
                                                                ? 'bg-blue-500 text-white'
                                                                : 'bg-slate-100 text-slate-600'
                                                        }`}>
                                                            {letter}
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div
                                                    key={idx}
                                                    onClick={() => handleOptionSelect(option)}
                                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                                        isSelected
                                                            ? 'border-blue-500 bg-blue-50 shadow-md'
                                                            : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                                            isSelected
                                                                ? 'border-blue-500 bg-blue-500'
                                                                : 'border-slate-300'
                                                        }`}>
                                                            {isSelected && (
                                                                <div className="w-2 h-2 rounded-full bg-white"></div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            {(isImage || isOptionImg) ? (
                                                                <img
                                                                    src={getImagePath(option)}
                                                                    alt=""
                                                                    className="max-w-full max-h-24 object-contain rounded-lg"
                                                                    onError={(e) => {
                                                                        e.target.src = '/images/placeholder.png';
                                                                        e.target.alt = 'Imagen no disponible';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <span className="text-slate-700">
                                                                    {option}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-sm font-medium text-slate-400">
                                                            {letter}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <button
                                        onClick={onSubmit}
                                        className="mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-md w-full"
                                    >
                                        <Send size={18} /> {t.send}
                                    </button>
                                    {isSubmitted && (
                                        <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                                            <CheckCircle size={16} />
                                            {t.answerSaved}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center pt-6 mt-6 border-t border-slate-200">
                            <button
                                disabled={isFirst}
                                onClick={onPrevious}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm border border-slate-200"
                            >
                                <ChevronLeft size={18} /> {t.previous}
                            </button>
                            <span className="text-sm text-slate-400">
                                Pregunta {questionNumber} de {totalQuestions}
                            </span>
                            <button
                                disabled={isLast}
                                onClick={onNext}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm border border-slate-200"
                            >
                                {t.next} <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pregunta;