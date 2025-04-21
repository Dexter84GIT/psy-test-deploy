import questionsPack from "./modules/questionsPack"

const header = document.getElementById('quiz-header');
const body = document.getElementById('quiz-body');
const buttons = document.getElementById('quiz-buttons')
const formSubmit = document.getElementById('submit-button')
const questionCounter = document.getElementById('question-counter')

const allQoestions = questionsPack()

const questions = allQoestions.questions
const questionDescriptions = allQoestions.questionDescriptions
const finishDescriptions = allQoestions.finishDescriptions

let questionIndex = 0
let levels = []

const cleadPage = () => {
    body.innerHTML = ''
}

const quiz = () => {
    body.innerHTML = `
        <div class="form">
            <form action="" class="contact-form" id="dataForm">
                <div class="input-field">
                    <label for="name-input">имя</label>
                    <input type="text" name="name" id="name-input" required>
                </div>
                <div class="input-field">
                    <label for="email-input">email</label>
                    <input type="email" name="email" id="email-input" required>
                </div>
                <div class="input-field">
                    <label for="tel-input">телефон</label>
                    <input type="tel" name="tel" id="tel-input" required>
                </div>
                <button class="submit-button" id="submit-button" type="submit">отправить</button>
                <p id="formMessage"></p>
            </form>
        </div>
    `
    formControl()
}
// форма и всё что с ней связано
const formControl = () => {
    document.getElementById('dataForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        if (data) {
            // записываеи данные в localStorage
            localStorage.setItem('userdata', JSON.stringify(data))
            disclaimer()
        }
    });
}

// текст с правилами
const disclaimer = () => {
    cleadPage()
    body.innerHTML = `
    <ul class="disclaimer">
        <li class="disclaimer-text">
            <p>тебе предстоит выполнить 45 заданий, на выполнение потребуется около 30 минут. ты можешь
                делать паузы в работе.</p>
        </li>
        <li class="disclaimer-text">
            <p>в каждом задании тебе предлагается 6 утверждений, никак не связанных между собой. прочитай их
                внимательно и выбери одно или два, соответствующие твоим ощущениям о себе прямо сейчас.</p>
        </li>
        <li class="disclaimer-text">
            <p>здесь нет правильных или неправильных ответов. слушай себя внимательно и старайся отмечать
                то, что откликается тебе наибольшим образом. если ни одно из утверждений не откликается на
                100% — выбери наибольшим образом похожее на то, как ты мыслишь и действуешь.</p>
        </li>
        <li class="disclaimer-text">
            <p>в заданиях, где ты выберешь два варианта ответа, нужно распределить их значимость для тебя.
                более подходящее тебе утверждение отметь числом «70», менее подходящее — числом «30». там,
                где выбран только один вариант ответа, должна стоять отметка «100».</p>
        </li>
        <li class="disclaimer-text">
            <p>в случае ошибочного выбора нажми кнопку "сброс" и выбери утверждения заново. если выбор
                правильный, нажми "ответить". внимание! вернуться к предыдущему вопросу и исправить ответ —
                невозможно, так что выбирай с умом сразу. удачи!</p>
        </li>
        <li>
            <button class="submit-button" id="startQuiz">все понятно, начать тестирование</button>
        </li>
    </ul>
    `
    document.getElementById('startQuiz').addEventListener('click', showQuestion)

}

// показать вопрос
const showQuestion = () => {
    cleadPage()
    let answersLevel = []
    // вставляем кнопки

    questionCounter.textContent = questionIndex + 1

    buttons.innerHTML = `
        <div class="buttons-wrapper" id="buttons-wrapper">
            <div class="buttons-block" id="buttons-block">
                <button class="main-button cancel-button" id="cancel-question">сброс ответов</button>
                <button class="main-button next-button" id="next-question" disabled>следующий вопрос</button>
            </div>
        </div>
    `

    const nextBtn = document.getElementById('next-question')
    const cancelBtn = document.getElementById('cancel-question')

    questions[questionIndex]['answers'].map((answer, index) => {
        // для каждого ответа создаем <li> с текстом и процентами
        const questionTemplate = `
        <ul class="answers-list">
            <li class="answer df jcsb aic" data-value="${index}">
                <span>${answer}</span>
                <div class="select df">
                    <div class="select_100 select-box">
                        <label>100
                            <input type="checkbox" class="select_input" id="input_100" value="100">                
                        </label>
                    </div>
                    <div class="select_70 select-box">
                        <label>70
                            <input type="checkbox" class="select_input" id="input_70" value="70">                    
                        </label>
                    </div>
                    <div class="select_30 select-box">
                        <label>30
                            <input type="checkbox" class="select_input" id="input_30" value="30">
                        </label>
                    </div>
                </label>
                </div>
            </li>        
        </ul>
        `
        // // рендерим ответы в верстку
        body.innerHTML += questionTemplate;

        const input = document.querySelectorAll('.select-box')
        let sum = 0

        const resetQuestion = () => {
            const allCheckedInputs = document.querySelectorAll('.checked');
            sum = 0
            allCheckedInputs.forEach(item => {
                item.classList.remove('checked')
                nextBtn.disabled = true
            })
        }

        input.forEach(item => {
            item.addEventListener('click', (e) => {
                if ((e.target.closest('.select-box')) && (e.target.classList.contains('select_input'))) {
                    const checkedInputValue = item.querySelector('.select_input').value
                    const allCheckedInputs = document.querySelectorAll('.checked');
                    e.target.classList.toggle('checked')
                    sum += +checkedInputValue
                    if (sum === 100) {
                        nextBtn.disabled = false
                    } else if ((sum > 100) || (allCheckedInputs.length > 1)) {
                        resetQuestion()
                    } else if (sum === 60) {
                        resetQuestion()
                    } else {
                        return
                    }
                }
            })
        })

        nextBtn.addEventListener('click', checkAnswer);
        cancelBtn.addEventListener('click', resetQuestion)
    })
}

// проверка ответа
const checkAnswer = () => {
    // получаем отмеченные ответы
    const allCheckedInputs = document.querySelectorAll('.answer:has(.checked)');
    const thisAnswerLevel = questions[questionIndex]['level']

    let answer70 = ''
    let answer30 = ''

    if (allCheckedInputs.length === 1) {
        levels.push(thisAnswerLevel[allCheckedInputs[0].dataset.value]);
    } else if (allCheckedInputs.length === 2) {
        allCheckedInputs.forEach(answer => {
            const parent70 = answer.querySelector('.select_70 .checked')
            const parent30 = answer.querySelector('.select_30 .checked')

            if (parent70) {
                const parent70Level = parent70.closest('.answer').dataset.value
                answer70 = (thisAnswerLevel[parent70Level])
            }
            if (parent30) {
                const parent30Level = parent30.closest('.answer').dataset.value
                answer30 = (thisAnswerLevel[parent30Level])
            }
        })
        // проверки на пары уровней
        // a1 - a2
        if ((answer70 == 'a1') && (answer30 == 'a2')) {
            levels.push('a1')
        } else if ((answer30 == 'a1') && (answer70 == 'a2')) {
            levels.push('a2')
            // a1 - b1
        } else if ((answer30 == 'a1') && (answer70 == 'b1')) {
            levels.push('a2')
        } else if ((answer70 == 'a1') && (answer30 == 'b1')) {
            levels.push('a2')
            // a1 - b2
        } else if ((answer70 == 'a1') && (answer30 == 'b2')) {
            levels.push('a2')
        } else if ((answer30 == 'a1') && (answer70 == 'b2')) {
            levels.push('b1')
            // a1 - c1
        } else if ((answer70 == 'a1') && (answer30 == 'c1')) {
            levels.push('b1')
        } else if ((answer30 == 'a1') && (answer70 == 'c1')) {
            levels.push('b1')
            // a1 - c2
        } else if ((answer70 == 'a1') && (answer30 == 'c2')) {
            levels.push('b1')
        } else if ((answer30 == 'a1') && (answer70 == 'c2')) {
            levels.push('b2')
            // a2 - b1
        } else if ((answer70 == 'a2') && (answer30 == 'b1')) {
            levels.push('a2')
        } else if ((answer30 == 'a2') && (answer70 == 'b1')) {
            levels.push('b1')
            // a2 - b2
        } else if ((answer70 == 'a2') && (answer30 == 'b2')) {
            levels.push('b1')
        } else if ((answer30 == 'a2') && (answer70 == 'b2')) {
            levels.push('b1')
            // a2 - c1                
        } else if ((answer70 == 'a2') && (answer30 == 'c1')) {
            levels.push('b1')
        } else if ((answer30 == 'a2') && (answer70 == 'c1')) {
            levels.push('b2')
            // a2 - c2
        } else if ((answer70 == 'a2') && (answer30 == 'c2')) {
            levels.push('b2')
        } else if ((answer30 == 'a2') && (answer70 == 'c2')) {
            levels.push('b2')
            // b1 - b2
        } else if ((answer70 == 'b1') && (answer30 == 'b2')) {
            levels.push('b1')
        } else if ((answer30 == 'b1') && (answer70 == 'b2')) {
            levels.push('b2')
            // b1 - c1
        } else if ((answer70 == 'b1') && (answer30 == 'c1')) {
            levels.push('b2')
        } else if ((answer30 == 'b1') && (answer70 == 'c1')) {
            levels.push('b2')
            // b1 - c2
        } else if ((answer70 == 'b1') && (answer30 == 'c2')) {
            levels.push('b2')
        } else if ((answer30 == 'b1') && (answer70 == 'c2')) {
            levels.push('c1')
            // b2 - c1
        } else if ((answer70 == 'b2') && (answer30 == 'c1')) {
            levels.push('b2')
        } else if ((answer30 == 'b2') && (answer70 == 'c1')) {
            levels.push('c1')
            // b2 - c2
        } else if ((answer70 == 'b2') && (answer30 == 'c2')) {
            levels.push('c1')
        } else if ((answer30 == 'b2') && (answer70 == 'c2')) {
            levels.push('c1')
            // c1 - c2
        } else if ((answer70 == 'c1') && (answer30 == 'c2')) {
            levels.push('c1')
        } else if ((answer30 == 'c1') && (answer70 == 'c2')) {
            levels.push('c2')
        }
    }

    if ((questionIndex) >= (questions.length - 1)) {
        results()
    } else {
        questionIndex++
        showQuestion()
    }
}

// результаты теста
const results = () => {

    const finishLevel = levels.slice(0)
    const data = JSON.parse(localStorage.getItem('userdata'))

    let finishLevelA1 = finishLevel.filter(x => x === "a1").length
    let finishLevelA2 = finishLevel.filter(x => x === "a2").length
    let finishLevelB1 = finishLevel.filter(x => x === "b1").length
    let finishLevelB2 = finishLevel.filter(x => x === "b2").length
    let finishLevelC1 = finishLevel.filter(x => x === "c1").length
    let finishLevelC2 = finishLevel.filter(x => x === "c2").length

    // переменная под общий уровень
    let finishLevelValue = ''
    // переменная под описание общего уровня
    let finishLevelDescription = ''
    const allData = [finishLevelValue, finishLevel, data]
    // заменяем значения в массиве на числа
    finishLevel.forEach(level => {
        if (level.includes('a1')) {
            finishLevel[finishLevel.indexOf('a1')] = -50;
        }
        if (level.includes('a2')) {
            finishLevel[finishLevel.indexOf('a2')] = -20;
        }
        if (level.includes('b1')) {
            finishLevel[finishLevel.indexOf('b1')] = -10;
        }
        if (level.includes('b2')) {
            finishLevel[finishLevel.indexOf('b2')] = 1;
        }
        if (level.includes('c1')) {
            finishLevel[finishLevel.indexOf('c1')] = 5;
        }
        if (level.includes('c2')) {
            finishLevel[finishLevel.indexOf('c2')] = 10;
        }
    })
    const sumOfLevels = finishLevel.reduce((acc, number) => acc + number, 0);
    if ((sumOfLevels > -2250) && (sumOfLevels < -450)) {
        finishLevelValue = 'a1'
    } else if ((sumOfLevels > -451) && (sumOfLevels < -225)) {
        finishLevelValue = 'a2'
    } else if ((sumOfLevels > -226) && (sumOfLevels < 90)) {
        finishLevelValue = 'b1'
    } else if ((sumOfLevels > 91) && (sumOfLevels < 225)) {
        finishLevelValue = 'b2'
    } else if ((sumOfLevels > 226) && (sumOfLevels < 400)) {
        finishLevelValue = 'c1'
    } else if ((sumOfLevels > 400) && (sumOfLevels <= 450)) {
        finishLevelValue = 'c2'
    }


    // выводим описание к каждому уровню
    switch (finishLevelValue) {
        case ('a1'):
            finishLevelDescription = finishDescriptions[0]
            break;
        case ('a2'):
            finishLevelDescription = finishDescriptions[1]
            break;
        case ('b1'):
            finishLevelDescription = finishDescriptions[2]
            break;
        case ('b2'):
            finishLevelDescription = finishDescriptions[3]
            break;
        case ('c1'):
            finishLevelDescription = finishDescriptions[4]
            break;
        case ('c2'):
            finishLevelDescription = finishDescriptions[5]
            break;
    }

    cleadPage()
    header.textContent = `
        поздравляем с завершением теста, ${data.name}
    `

    body.innerHTML = `<div class="df jcsb finish-level">
        <p class="level df aic">общий уровень: <span>${finishLevelValue}</span></p>
        <div class="levels-summary df">
            <div class="df fdc"><p class="level-name">A1</p><p class="level-value">${finishLevelA1}</p></div>
            <div class="df fdc"><p class="level-name">A2</p><p class="level-value">${finishLevelA2}</p></div>
            <div class="df fdc"><p class="level-name">B1</p><p class="level-value">${finishLevelB1}</p></div>
            <div class="df fdc"><p class="level-name">B2</p><p class="level-value">${finishLevelB2}</p></div>
            <div class="df fdc"><p class="level-name">C1</p><p class="level-value">${finishLevelC1}</p></div>
            <div class="df fdc"><p class="level-name">C2</p><p class="level-value">${finishLevelC2}</p></div>
        </div>
        <div class="finish-buttons">
            <a>отправить результаты на ${data.email}</a>
            <a>таблица рейтинга</a>
        </div>
    </div>`
    body.innerHTML += `<p class="level-description">${finishLevelDescription}</p>`
    questions.forEach((question, index) => {
        body.innerHTML += `
            <div class="result-table">
                <div class="result-levels df jcsb aic tooltip">
                    <p class="result-name">${index + 1}. ${question['question']}:</p>
                    <p class="result-value">${levels[index]}</p>
                    <span class="tooltip-text">${questionDescriptions[index]}</span>
                </div>
            </div>
        `
    })            // Отправляем данные на сервер
    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            finishLevelValue: finishLevelValue,
            finishLevelA1: finishLevelA1,
            finishLevelA2: finishLevelA2,
            finishLevelB1: finishLevelB1,
            finishLevelB2: finishLevelB2,
            finishLevelC1: finishLevelC1,
            finishLevelC2: finishLevelC2,
            userData: data  // используем данные пользователя
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        header.textContent = data.message;
    })
    .catch((error) => {
        console.error('Ошибка:', error);
        header.textContent = 'Произошла ошибка при отправке результатов.';
    });
    // fetch('http://localhost:8000/src/modules/mailer', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         finishLevelValue: finishLevelValue,
    //         finishLevel: finishLevel,
    //         userData: data  // используем данные пользователя
    //     }),
    // })
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         return response.json();
    //     })
    //     .then(data => {
    //         header.textContent = data.message;
    //     })
    //     .catch((error) => {
    //         console.error('Ошибка:', error);
    //         header.textContent = 'Произошла ошибка при отправке результатов.';
    //     });
}
// events


quiz()