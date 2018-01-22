import XElement from '/x-element/x-element.js';

export default class XAmount extends XElement {
    html(){
        return `
            <x-currency-1></x-currency-1>
            <x-currency-2></x-currency-2>`
    }

    set value(value) {
        value = Number(value);
        this._currency1 = XAmount.format(value, 3);
        this._currency2 = XAmount.format(value * 17.1, 2);
    }

    set _currency1(value) {
        this.$('x-currency-1').textContent = value;
    }

    set _currency2(value) {
        this.$('x-currency-2').textContent = value;
    }

    static format(number, decimals = 3) {
        decimals = Math.pow(10, decimals);
        return Math.round(number * decimals) / decimals;
    }
}

class XAmountInput extends XAmount {
    html(){
        return `
            <x-currency-1>
                <input placeholder="00.00" type="number">
            </x-currency-1>
            <x-currency-2></x-currency-2>`
    }

    onCreate() {
        this.$input = this.$('input');
        this.$input.addEventListener('change', e => this._valueChanged());
        this.$input.addEventListener('keyup', e => this._valueChanged(e));
        if (window.innerWidth > 420) return;
        this.$input.setAttribute('disabled', '1');
    }

    _valueChanged(e) {
        if (e && e.keyCode === 13) return this.fire('x-enter');
        this.value = this.$input.value;
    }

    set _currency1(value) {
        this.$input.value = value || '';
        this.fire('x-change', value);
    }

    focus() {
        if (window.innerWidth < 420) return;
        requestAnimationFrame(_ => this.$input.focus());
    }

    set value(value) {
        super.value = value;
    }

    get value() {
        return this.$input.value;
    }
}