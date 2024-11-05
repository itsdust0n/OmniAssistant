// ==UserScript==
// @name         ReviewHelper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Try to write an individual review for more than 100 students and not to die.
// @author       itsdust0n
// @match        https://omni.top-academy.ru/*
// @icon         https://omni.top-academy.ru/favicon.ico?v=2
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.hash !== '#/stud_profile') return;

    const listeningOnClasses = ["слушает на занятиях", "слушает материал", "слушает на парах"];
    const doingPracticesOnClasses = ["выполняет задания на паре", "выполняет поставленные задания", "выполняет задания", "выполняет все практики", "выполняет практики"];
    const getDistractedOnClasses = ["отвлекается"];

    const doingHW = ["выполняет домашние задания в срок", "выполняет домашние задания", "с выполнением домашних заданий проблем нет"];
    const notDoingHomework = ["не выполняет домашние задания"];
    const hwDeadlineProblems = ["выполняет домашние задания, но с опозданием", "есть проблема с дедлайнами"];

    const goingOnTime = ["на пары приходит вовремя", "на занятия приходит вовремя", "на пары приходит без опозданий", "на занятия приходит без опозданий"];
    const goingLate = ["опаздывает на занятия", "опаздывает на пары"];

    const recommendations = {
        distraction: [
            "Рекомендую сосредоточиться на занятиях и избегать отвлечений.",
            "Рекомендую уделять больше внимания материалу на занятиях.",
            "Рекомендую уменьшить количество отвлекающих факторов на парах.",
            "Рекомендую организовать свое рабочее место, чтобы избежать отвлечений.",
            "Рекомендую активно участвовать в обсуждениях, чтобы лучше усваивать материал."
        ],
        homeworkDeadline: [
            "Рекомендую организовать свое время лучше и соблюдать сроки выполнения домашних заданий.",
            "Рекомендую заранее планировать время для выполнения домашних заданий.",
            "Рекомендую обратить внимание на сроки, чтобы избежать проблем с дедлайнами.",
            "Рекомендую работать над домашними заданиями постепенно, а не в последний момент.",
            "Рекомендую использовать календарь для отслеживания дедлайнов."
        ],
        tardiness: [
            "Рекомендую приходить на занятия вовремя для лучшего восприятия материала.",
            "Рекомендую обратить внимание на расписание и планировать приход на занятия заранее.",
            "Рекомендую избегать опозданий, чтобы не пропускать важные моменты на занятиях.",
            "Рекомендую просыпаться чуть раньше, чтобы успевать приходить на занятия.",
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
            "Рекомендую продолжать в том же духе и не сдаваться!",
            "Рекомендую сохранять упорство и стремление к знаниям.",
            "Рекомендую не останавливаться на достигнутом и продолжать развиваться.",
            "Рекомендую постоянно искать возможности для улучшения своих навыков.",
            "Рекомендую поддерживать высокую мотивацию и активно учиться."
        ]
    };
    
    

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

    function getRandomRecommendation(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    function generateReview() {
        const studentName = getStudentName();
        if (!studentName) return "Имя студента не найдено";
    
        let positives = [];
        let negatives = [];
        let homeworkReview = "";  // Новая переменная для домашнего задания
        let recommendation = "";
    
        // Работа на парах
        if (document.getElementById("Слушает на парах")?.checked) {
            if (!savedSelections.work.listening) {
                savedSelections.work.listening = getRandomElement(listeningOnClasses);
            }
            positives.push(savedSelections.work.listening);
        }
        if (document.getElementById("Выполняет задания")?.checked) {
            if (!savedSelections.work.practices) {
                savedSelections.work.practices = getRandomElement(doingPracticesOnClasses);
            }
            positives.push(savedSelections.work.practices);
        }
        if (document.getElementById("Отвлекается")?.checked) {
            if (!savedSelections.work.distracted) {
                savedSelections.work.distracted = getRandomElement(getDistractedOnClasses);
            }
            negatives.push(savedSelections.work.distracted);
        }
    
        // Домашнее задание
        let homeworkStatus = document.querySelector("input[name='homework']:checked")?.value;
        if (homeworkStatus) {
            if (!savedSelections.homework) {
                if (homeworkStatus === "Выполняет") savedSelections.homework = getRandomElement(doingHW);
                else if (homeworkStatus === "Не выполняет") savedSelections.homework = getRandomElement(notDoingHomework);
                else if (homeworkStatus === "Проблема с дедлайнами") savedSelections.homework = getRandomElement(hwDeadlineProblems);
            }
            homeworkReview = `${studentName} ${savedSelections.homework}.`;  // Отдельное предложение для домашнего задания
        }
    
        // Посещаемость
        let attendanceStatus = document.querySelector("input[name='attendance']:checked")?.value;
        if (attendanceStatus) {
            if (!savedSelections.attendance) {
                if (attendanceStatus === "Приходит вовремя") savedSelections.attendance = getRandomElement(goingOnTime);
                else if (attendanceStatus === "Опаздывает") savedSelections.attendance = getRandomElement(goingLate);
            }
            if (attendanceStatus === "Приходит вовремя") positives.push(savedSelections.attendance);
            else negatives.push(savedSelections.attendance);
        }
    
        // Формируем отзыв
        let reviewParts = [];
    
        if (positives.length > 0) {
            reviewParts.push(`${studentName} ${positives.join(" и ")}`);
        }
    
        // Добавляем предложение о домашнем задании
        if (homeworkReview) {
            reviewParts.push(homeworkReview);
        }
    
        // Негативные замечания
        if (negatives.length > 0) {
            const negativeIntro = Math.random() < 0.5 ? "Но" : "Однако";
            reviewParts.push(`${negativeIntro} ${negatives.join(" и ")}`);
        }
    
        // Рекомендации
        if (negatives.includes("не выполняет домашние задания")) {
            recommendation = getRandomRecommendation(recommendations.homeworkDeadline);
        } else if (negatives.includes("отвлекается")) {
            recommendation = getRandomRecommendation(recommendations.distraction);
        } else if (negatives.includes("опаздывает на занятия")) {
            recommendation = getRandomRecommendation(recommendations.tardiness);
        } else if (negatives.includes("не участвует активно на занятиях")) {
            recommendation = getRandomRecommendation(recommendations.participation);
        }
    
        // Если нет негативов, давать общую рекомендацию
        if (recommendation === "") {
            recommendation = getRandomRecommendation(recommendations.overallImprovement);
        }
    
        reviewParts.push(recommendation.trim());
    
        return reviewParts.join(". ") + ".";
    }            

    function addElements() {
        const reviewsDiv = document.getElementById('reviews');
        if (!reviewsDiv) return false;

        const targetDiv = reviewsDiv.querySelector('.paddingLeft.clearfix.paddingRight');
        if (!targetDiv) return false;

        if (targetDiv.querySelector('#custom-checkbox-section')) return true;

        const container = document.createElement('div');
        container.id = 'custom-checkbox-section';
        container.style.display = 'flex';
        container.style.gap = '20px';

        function createCheckboxSection(title, options) {
            const section = document.createElement('div');
            const heading = document.createElement('h4');
            heading.textContent = title;
            section.appendChild(heading);

            options.forEach(option => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = option;
                checkbox.value = option;

                checkbox.addEventListener('change', () => {
                    updateTextarea(generateReview());
                });

                const label = document.createElement('label');
                label.htmlFor = option;
                label.textContent = option;

                section.appendChild(checkbox);
                section.appendChild(label);
                section.appendChild(document.createElement('br'));
            });

            return section;
        }

        function createRadioSection(title, name, options) {
            const section = document.createElement('div');
            const heading = document.createElement('h4');
            heading.textContent = title;
            section.appendChild(heading);

            options.forEach(option => {
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = name;
                radio.value = option;

                radio.addEventListener('change', () => {
                    updateTextarea(generateReview());
                });

                const label = document.createElement('label');
                label.htmlFor = option;
                label.textContent = option;

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

        container.appendChild(workSection); 
        container.appendChild(homeworkSection);
        container.appendChild(attendanceSection);
        targetDiv.appendChild(container);

        return true;
    }

    const observer = new MutationObserver((mutations, obs) => {
        if (addElements()) {
            obs.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
