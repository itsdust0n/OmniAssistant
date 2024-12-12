// ==UserScript==
// @name         Omni Assistant
// @namespace    https://github.com/itsdust0n/OmniAssistant
// @version      1.1
// @description  Useful utilities for working with Omni
// @author       itsdust0n
// @match        https://omni.top-academy.ru/*
// @icon         https://omni.top-academy.ru/favicon.ico?v=2
// @grant        none
// @homepageURL  https://github.com/itsdust0n/OmniAssistant
// @supportURL   https://github.com/itsdust0n/OmniAssistant/issues
// @downloadURL  https://github.com/itsdust0n/OmniAssistant/raw/refs/heads/main/omniassistant.user.js
// @updateURL    https://github.com/itsdust0n/OmniAssistant/raw/refs/heads/main/omniassistant.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const locales = {
        listeningOnClasses: [
            "слушает на занятиях",
            "слушает материал",
            "слушает на парах",
            "уделяет внимание материалу",
            "вникает в тему на занятиях",
            "обращает внимание на информацию на паре",
            "слушает и воспринимает информацию на занятиях"
        ],
        doingPracticesOnClasses: [
            "выполняет задания на паре",
            "выполняет поставленные задания",
            "выполняет задания",
            "выполняет все практики",
            "выполняет практики",
            "занимается выполнением практических заданий на паре"
        ],
        getDistractedOnClasses: [
            "отвлекается на занятиях",
            "отвлекается на парах",
            "отвлекается во время пар",
            "периодически теряет внимание на занятиях",
            "не всегда сосредотачивается на материале",
            "стоило бы быть более внимателен на занятиях",
            "иногда теряет фокус во время пар",
            "время от времени отвлекается",
            "порой не сосредотачивается на занятиях"
        ],
        doingHW: [
            "Выполняет домашние задания в срок",
            "Выполняет домашние задания",
            "С выполнением домашних заданий проблем нет",
            "Регулярно сдает домашние задания вовремя",
            "Выполняет все домашние задания вовремя",
            "Всегда успевает сдать ДЗ в срок",
            "Успешно выполняет ДЗ в установленные сроки"
        ],
        notDoingHomework: [
            "не выполняет домашние задания",
            "игнорирует домашние задания",
            "не сдает домашние задания",
            "не выполяет ДЗ",
            "не приступает к выполнению ДЗ",
            "не сдает ДЗ"
        ],
        hwDeadlineProblems: [
            "выполняет домашние задания с опозданием",
            "есть проблема с дедлайнами",
            "опаздывает с выполнением домашних заданий",
            "иногда не успевает сдать ДЗ вовремя",
            "домашние задания сдаются с задержкой",
            "бывают проблемы с соблюдением срока сдачи ДЗ",
            "периодически не успевает сдать домашку вовремя"
        ],
        goingOnTime: [
            "на пары приходит вовремя",
            "на занятия приходит вовремя",
            "на пары приходит без опозданий",
            "на занятия приходит без опозданий",
            "всегда приходит на занятия вовремя",
            "регулярно приходит на пары вовремя",
            "не опаздывает на пары",
            "не опаздывает на занятия",
        ],
        goingLate: [
            "опаздывает на занятия",
            "опаздывает на пары",
            "время от времени опаздывает на занятия",
            "бывают случаи опозданий на пары",
            "приходит на занятия с задержкой",
            "не всегда успевает прийти на занятия вовремя",
            "есть проблема с пунктуальностью",
            "иногда опаздывает на занятия"
        ],
        recommendations: {
            distraction: [
                "Рекомендую сосредоточиться на занятиях и избегать отвлечений.",
                "Рекомендую уделять больше внимания материалу на занятиях.",
                "Рекомендую уменьшить количество отвлекающих факторов на парах.",
            ],
            homeworkDeadline: [
                "Рекомендую организовать свое время лучше и соблюдать сроки выполнения домашних заданий.",
                "Рекомендую заранее планировать время для выполнения домашних заданий.",
                "Рекомендую обратить внимание на сроки, чтобы избежать проблем с дедлайнами.",
                "Рекомендую работать над домашними заданиями постепенно, а не в последний момент.",
                "Рекомендую использовать календарь для отслеживания дедлайнов."
            ],
            notDoingHomework: [
                "Рекомендую сосредоточиться на выполнении ДЗ.",
                "Рекомендую сосредоточиться на выполнении домашних заданий.",
                "Рекомендую выполнять домашние задания, ведь так можно получить балл выше."
            ],
            tardiness: [
                "Рекомендую приходить на занятия вовремя для лучшего восприятия материала.",
                "Рекомендую обратить внимание на расписание и планировать приход на занятия заранее.",
                "Рекомендую избегать опозданий, чтобы не пропускать важные моменты на занятиях.",
                "Рекомендую заранее проверять транспорт и его расписание, чтобы избежать задержек."
            ],
            participation: [
                "Рекомендую активнее участвовать в обсуждениях, это поможет вам лучше усвоить материал.",
                "Рекомендую задавать вопросы на занятиях, если что-то непонятно.",
                "Рекомендую делиться своими мыслями и идеями на парах.",
                "Рекомендую проявлять инициативу в групповых проектах.",
                "Рекомендую не стесняться высказывать свое мнение, это важно для вашего развития."
            ],
            overallImprovement: [
                "Продолжай в том же духе и не сдавайся!",
                "Молодец, так держать!",
                "Ты показываешь отличные результаты, продолжай стараться!",
                "Здорово, прогресс налицо!",
                "Отличная работа! Видно, что стараешься.",
                "Молодец! Видно, что ты стремишься к знаниям.",
                "Так держать! Каждый шаг — это прогресс.",
                "Прекрасная работа! Всё получится!",
                "Ты молодец, твои старания заметны!",
                "Замечательный прогресс, продолжай в том же духе!",
                "Хорошая работа! Главное — не останавливаться.",
            ]
        }
    };


    const ReviewAssistant = (function() {
        function init() {
            initializeUI();
            monitorUrlChanges();
            console.log(">>> OA: Review Assistant initialized");
        }


        const savedSelections = {
            work: {},
            homework: null,
            attendance: null
        };


        function getRandomElement(array) {
            return array[Math.floor(Math.random() * array.length)];
        }
    
    
        function getStudentName() {
            const nameElement = document.querySelector(".student-name.ng-binding");
            if (!nameElement) return null;
            const nameParts = nameElement.textContent.trim().split(" ");
            return nameParts.length > 1 ? nameParts[1] : nameParts[0];
        }
    
    
        function updateTextarea(reviewText) {
            const textarea = document.querySelector(".area_wrap textarea");
            if (textarea) {
                textarea.value = reviewText;
            } else {
                console.warn("Поле комментария не найдено");
            }
        }
    
    
        function generateReview() {
            const studentName = getStudentName();
            if (!studentName) return "Имя студента не найдено";
    
            let positives = [];
            let negatives = [];
            let negativesCodes = [];
            let homeworkReview = "";
            let recommendation = "";
    
            // Работа на парах
            if (document.getElementById("Слушает на парах")?.checked) {
                if (!savedSelections.work.listening) {
                    savedSelections.work.listening = getRandomElement(locales.listeningOnClasses);
                }
                positives.push(savedSelections.work.listening);
            }
            if (document.getElementById("Выполняет задания")?.checked) {
                if (!savedSelections.work.practices) {
                    savedSelections.work.practices = getRandomElement(locales.doingPracticesOnClasses);
                }
                positives.push(savedSelections.work.practices);
            }
            if (document.getElementById("Отвлекается")?.checked) {
                if (!savedSelections.work.distracted) {
                    savedSelections.work.distracted = getRandomElement(locales.getDistractedOnClasses);
                }
                negatives.push(savedSelections.work.distracted);
                negativesCodes.push("distraction");
            }
    
            // Домашнее задание
            let homeworkStatus = document.querySelector("input[name='homework']:checked")?.value;
            if (homeworkStatus) {
                savedSelections.homework = null; // Очищаем предыдущее значение, чтобы обновить домашнее задание
    
                if (homeworkStatus === "Выполняет") {
                    savedSelections.homework = getRandomElement(locales.doingHW);
                    homeworkReview = savedSelections.homework; // Добавляем в отдельное поле для отображения, не добавляя к "негативам"
                } else if (homeworkStatus === "Не выполняет") {
                    savedSelections.homework = getRandomElement(locales.notDoingHomework);
                    negatives.push(savedSelections.homework); // Добавляем негативное замечание только сюда
                    negativesCodes.push("notDoingHomework");
                } else if (homeworkStatus === "Проблема с дедлайнами") {
                    savedSelections.homework = getRandomElement(locales.hwDeadlineProblems);
                    negatives.push(savedSelections.homework); // Добавляем негативное замечание только сюда
                    negativesCodes.push("deadlineProblem");
                }
            }
    
            // Посещаемость
            let attendanceStatus = document.querySelector("input[name='attendance']:checked")?.value;
            if (attendanceStatus) {
                if (!savedSelections.attendance) {
                    if (attendanceStatus === "Приходит вовремя") {
                        savedSelections.attendance = getRandomElement(locales.goingOnTime);
                    } else if (attendanceStatus === "Опаздывает") {
                        savedSelections.attendance = getRandomElement(locales.goingLate);
                        negatives.push(savedSelections.attendance); // Добавляем негативное замечание
                        negativesCodes.push("tardiness")
                    }
                }
                if (attendanceStatus === "Приходит вовремя") {
                    positives.push(savedSelections.attendance);
                }
            }
    
            // Формируем отзыв
            let reviewParts = []; // Начинаем с пустого массива
    
            // Положительные замечания
            if (positives.length > 0) {
                let positivesText;
                if (positives.length === 1) {
                    positivesText = positives[0]; // Один элемент — без изменений
                } else if (positives.length === 2) {
                    positivesText = positives.join(" и "); // Два элемента — соединяем "и"
                } else {
                    // Больше двух элементов — перечисляем через запятую и добавляем "и" перед последним
                    positivesText = positives.slice(0, -1).join(", ") + " и " + positives[positives.length - 1];
                }
                reviewParts.push(positivesText);
            }
    
            // Добавляем предложение о домашнем задании
            if (homeworkReview) {
                reviewParts.push(homeworkReview); // Не добавляем точку здесь
            }
    
            // Негативные замечания
            if (negatives.length > 0) {
                const negativeIntro = Math.random() < 0.5 ? "Но" : "Однако";
                let negativesText;
    
                if (negatives.length === 1) {
                    negativesText = negatives[0];
                } else if (negatives.length === 2) {
                    negativesText = negatives.join(" и ");
                } else {
                    negativesText = negatives.slice(0, -1).join(", ") + " и " + negatives[negatives.length - 1];
                }
    
                reviewParts.push(`${negativeIntro} ${negativesText}`);
            }
    
            // Рекомендации
            if (negativesCodes.includes("notDoingHomework")) {
                recommendation = getRandomElement(locales.recommendations.notDoingHomework);
            } else if (negativesCodes.includes("deadlineProblem")) {
                recommendation = getRandomElement(locales.recommendations.homeworkDeadline);
            } else if (negativesCodes.includes("distraction")) {
                recommendation = getRandomElement(locales.recommendations.distraction);
            } else if (negativesCodes.includes("tardiness")) {
                recommendation = getRandomElement(locales.recommendations.tardiness);
            } else if (negativesCodes.includes("participation")) {
                recommendation = getRandomElement(locales.recommendations.participation);
            }
    
            // Если нет негативов, давать общую рекомендацию
            if (recommendation === "") {
                recommendation = getRandomElement(locales.recommendations.overallImprovement);
            }
    
            // Формируем финальный отзыв, добавляя имя студента только один раз
            let finalReview = `${studentName} ${reviewParts.join(". ")}. ${recommendation.trim()}`;
    
            // Убираем лишнюю точку, если она в конце
            if (finalReview.endsWith('. .')) {
                finalReview = finalReview.slice(0, -1); // Убираем лишнюю точку
            }
            console.log(`negatives: ${negatives}`);
            console.log(`negativesCodes: ${negativesCodes}`);
            // Возвращаем финальный отзыв
            return finalReview.trim();
        }
    
    
        function initializeUI() {
            const reviewsDiv = document.getElementById('reviews');
            if (!reviewsDiv) return false;
    
            const targetDiv = reviewsDiv.querySelector('.paddingLeft.clearfix.paddingRight');
            if (!targetDiv) return false;
    
            if (targetDiv.querySelector('#custom-checkbox-section')) return true;
    
            const container = document.createElement('div');
            container.id = 'custom-checkbox-section';
            container.style.display = 'flex';
            container.style.gap = '20px';
            container.style.padding = '15px';
            container.style.border = '1px solid #ddd';
            container.style.borderRadius = '8px';
            container.style.backgroundColor = '#f9f9f9';
            container.style.marginTop = '15px';
    
    
            function createFAQSection(title, option) {
                const section = document.createElement('div');
                section.style.border = '1px solid #e0e0e0';
                section.style.borderRadius = '8px';
                section.style.padding = '10px';
                section.style.backgroundColor = '#ffffff';
    
                const heading = document.createElement('h4');
                heading.textContent = title;
                heading.style.fontWeight = 'bold';
                heading.style.marginBottom = '8px';
                heading.style.color = '#333';
    
                section.appendChild(heading);
    
                const paragraph = document.createElement('p');
                paragraph.id = "RH__FAQParagraph";
                paragraph.textContent = option;
                paragraph.style.marginRight = '6px';
                paragraph.style.textWrap = 'wrap';
                paragraph.style.maxWidth = '20vw';
    
                section.appendChild(paragraph);
    
                return section;
            }
    
    
            function createCheckboxSection(title, options) {
                const section = document.createElement('div');
                section.style.border = '1px solid #e0e0e0';
                section.style.borderRadius = '8px';
                section.style.padding = '10px';
                section.style.backgroundColor = '#ffffff';
    
                const heading = document.createElement('h4');
                heading.textContent = title;
                heading.style.fontWeight = 'bold';
                heading.style.marginBottom = '8px';
                heading.style.color = '#333';
    
                section.appendChild(heading);
    
                options.forEach(option => {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = option;
                    checkbox.value = option;
                    checkbox.style.marginRight = '6px';
    
                    checkbox.addEventListener('change', () => {
                        updateTextarea(generateReview());
                    });
    
                    const label = document.createElement('label');
                    label.htmlFor = option;
                    label.textContent = option;
                    label.style.marginRight = '10px';
    
                    section.appendChild(checkbox);
                    section.appendChild(label);
                    section.appendChild(document.createElement('br'));
                });
    
                return section;
            }
    
    
            function createRadioSection(title, name, options) {
                const section = document.createElement('div');
                section.style.border = '1px solid #e0e0e0';
                section.style.borderRadius = '8px';
                section.style.padding = '10px';
                section.style.backgroundColor = '#ffffff';
    
                const heading = document.createElement('h4');
                heading.textContent = title;
                heading.style.fontWeight = 'bold';
                heading.style.marginBottom = '8px';
                heading.style.color = '#333';
    
                section.appendChild(heading);
    
                options.forEach(option => {
                    const radio = document.createElement('input');
                    radio.type = 'radio';
                    radio.name = name;
                    radio.value = option;
                    radio.style.marginRight = '6px';
    
                    radio.addEventListener('change', () => {
                        updateTextarea(generateReview());
                    });
    
                    const label = document.createElement('label');
                    label.htmlFor = option;
                    label.textContent = option;
                    label.style.marginRight = '10px';
    
                    section.appendChild(radio);
                    section.appendChild(label);
                    section.appendChild(document.createElement('br'));
                });
    
                return section;
            }
    
            const workSection = createCheckboxSection("Работа на парах", [
                "Слушает на парах",
                "Выполняет задания",
                "Отвлекается"
            ]);
    
            const homeworkSection = createRadioSection("ДЗ", "homework", [
                "Отсутствие упоминания",
                "Выполняет",
                "Не выполняет",
                "Проблема с дедлайнами"
            ]);
    
            const attendanceSection = createRadioSection("Посещаемость", "attendance", [
                "Отсутствие упоминания",
                "Опаздывает",
                "Приходит вовремя"
            ]);
    
            const faqSection = createFAQSection("Справка", 'Отзыв будет сформирован неправильно если не выбирать ничего из секции "работа на парах", эта часть отзыва является обязательной.')
    
            if (window.location.hash == '#/stud_profile') {
                container.appendChild(workSection);
                container.appendChild(homeworkSection);
                container.appendChild(attendanceSection);
                container.appendChild(faqSection);
                targetDiv.appendChild(container);
            }
    
            return true;
        }
    
    
        function monitorUrlChanges() {
            let currentStudent = null;
    
            const observer = new MutationObserver(() => {
                const newStudentName = document.querySelector('.student-name.ng-binding')?.textContent;
                if (newStudentName && newStudentName !== currentStudent) {
                    currentStudent = newStudentName;
                    initializeUI();
                }
            });
    
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    

        return { init };
    })();


    const ScriptSettings = (function() {
        // something will be here soon
    })();


    const PayrollCalculator = (function() {
        // something will be here soon
    })();


    (function Main() {
        console.log('> Initializing Omni Assistant...');
        ReviewAssistant.init();
        console.log('> Omni Assistant initialized');
    })();    
})();
