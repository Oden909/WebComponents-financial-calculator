class FinancialCalculator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                    max-width: 400px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    background-color: #f9f9f9;
                }
                label {
                    display: block;
                    margin: 10px 0 5px;
                }
                input {
                    width: 100%;
                    padding: 8px;
                    box-sizing: border-box;
                }
                .result {
                    margin-top: 20px;
                    padding: 10px;
                    background-color: #e8f4f8;
                    border: 1px solid #b6dfe5;
                    border-radius: 5px;
                }
                .result p {
                    margin: 5px 0;
                }
            </style>
            <form id="calculator-form">
                <label for="loan-amount">Сумма кредита (руб.):</label>
                <input type="number" id="loan-amount" min="0" required>
                
                <label for="interest-rate">Процентная ставка (%):</label>
                <input type="number" id="interest-rate" step="0.01" min="0" required>
                
                <label for="loan-term">Срок кредита (лет):</label>
                <input type="number" id="loan-term" min="0" required>

                <div class="result">
                    <p id="monthly-payment">Ежемесячный платеж: 0 руб.</p>
                    <p id="total-payment">Общая сумма выплат: 0 руб.</p>
                    <p id="total-interest">Общий процент по кредиту: 0 руб.</p>
                </div>
            </form>
        `;
        this.loanAmountInput = this.shadowRoot.getElementById('loan-amount');
        this.interestRateInput = this.shadowRoot.getElementById('interest-rate');
        this.loanTermInput = this.shadowRoot.getElementById('loan-term');
        this.monthlyPaymentElement = this.shadowRoot.getElementById('monthly-payment');
        this.totalPaymentElement = this.shadowRoot.getElementById('total-payment');
        this.totalInterestElement = this.shadowRoot.getElementById('total-interest');
        this.loanAmountInput.addEventListener('input', this.calculate.bind(this));
        this.interestRateInput.addEventListener('input', this.calculate.bind(this));
        this.loanTermInput.addEventListener('input', this.calculate.bind(this));
    }

    connectedCallback() {
        console.log('Финансовый калькулятор создан');
    }

    disconnectedCallback() {
        console.log('Финансовый калькулятор удален');
    }

    static get observedAttributes() {
        return ['loan-amount', 'interest-rate', 'loan-term'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Атрибут ${name} изменен с ${oldValue} на ${newValue}`);
        this.calculate();
    }

    calculate() {
        const loanAmount = parseFloat(this.loanAmountInput.value) || 0;
        const interestRate = parseFloat(this.interestRateInput.value) || 0;
        const loanTerm = parseFloat(this.loanTermInput.value) || 0;
        if (loanAmount > 0 && interestRate > 0 && loanTerm > 0) {
            const monthlyRate = (interestRate / 100) / 12;
            const numberOfPayments = loanTerm * 12;
            const monthlyPayment = loanAmount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
            const totalPayment = monthlyPayment * numberOfPayments;
            const totalInterest = totalPayment - loanAmount;
            this.monthlyPaymentElement.textContent = `Ежемесячный платеж: ${monthlyPayment.toFixed(2)} руб.`;
            this.totalPaymentElement.textContent = `Общая сумма выплат: ${totalPayment.toFixed(2)} руб.`;
            this.totalInterestElement.textContent = `Общий процент по кредиту: ${totalInterest.toFixed(2)} руб.`;
        } 
        else{
            this.monthlyPaymentElement.textContent = 'Ежемесячный платеж: 0 руб.';
            this.totalPaymentElement.textContent = 'Общая сумма выплат: 0 руб.';
            this.totalInterestElement.textContent = 'Общий процент по кредиту: 0 руб.';
        }
    }
}
customElements.define('financial-calculator', FinancialCalculator);
