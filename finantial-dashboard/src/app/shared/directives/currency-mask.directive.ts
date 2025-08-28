import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
    selector: '[currencyMask]',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CurrencyMaskDirective),
        multi: true
    }]
})
export class CurrencyMaskDirective implements ControlValueAccessor {
    private onChange = (value: any) => { };
    private onTouched = () => { };
    private valorNumericoPuro: string = '';

    constructor(private el: ElementRef) { }

    // Implementação da ControlValueAccessor
    writeValue(value: any): void {
        if (value) {
            this.valorNumericoPuro = this.limpar(value.toString());
            this.el.nativeElement.value = this.formatar(this.valorNumericoPuro);
        } else {
            this.el.nativeElement.value = '';
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    // Evento que formata o valor enquanto o usuário digita
    @HostListener('input', ['$event.target.value'])
    onInput(value: string) {
        this.valorNumericoPuro = this.limpar(value);
        this.el.nativeElement.value = this.formatar(this.valorNumericoPuro);
        this.onChange(this.valorNumericoPuro);
    }

    // Evento que garante que o valor seja formatado corretamente ao perder o foco
    @HostListener('blur')
    onBlur() {
        this.onTouched();
        this.el.nativeElement.value = this.formatar(this.valorNumericoPuro);
    }

    // Remove a máscara e retorna o valor numérico
    private limpar(valor: string): string {
        return valor.replace(/\D/g, '');
    }

    // Formata um valor numérico para o padrão monetário brasileiro
    private formatar(valor: string): string {
        if (!valor) return '';

        let valorNumerico = parseInt(valor, 10);
        if (isNaN(valorNumerico)) return '';

        let valorString = valorNumerico.toString();
        while (valorString.length < 3) {
            valorString = '0' + valorString;
        }

        const inteiros = valorString.slice(0, -2);
        const centavos = valorString.slice(-2);
        const inteirosFormatados = inteiros.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        return `R$ ${inteirosFormatados},${centavos}`;
    }
}