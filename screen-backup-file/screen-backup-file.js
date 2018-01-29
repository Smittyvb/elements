import XScreen from '../x-screen/x-screen.js';
import XSlides from '../x-slides/x-slides.js';
import XSuccessMark from '../x-success-mark/x-success-mark.js';
import XWalletBackup from '../x-wallet-backup/x-wallet-backup.js';
import XPasswordSetter from '../x-password-setter/x-password-setter.js';

export default class ScreenBackupFile extends XScreen {
    html() {
        return `
            <h1>Backup your Recovery File</h1>
            <x-slides>
                <x-slide>
                    <h2 secondary>Create a password to encrypt your backup file. Make sure you memorize it well because there is no way to recover it.</h2>
                    <x-password-setter></x-password-setter>
                    <x-grow></x-grow>
                    <button disabled="1">Next</button>
                </x-slide>
                <x-slide>
                    <x-loading-animation></x-loading-animation>
                    <h2>Encrypting Backup</h2>
                </x-slide>
                <x-slide>
                    <h2 secondary>Download your Recovery File to later recover your account</h2>
                    <x-wallet-backup></x-wallet-backup>
                    <x-grow></x-grow>
                </x-slide>
                <x-slide>
                    <x-success-mark></x-success-mark>
                    <h2>Backup Complete</h2>
                </x-slide>
            </x-slides>
            `
    }

    children() { return [XSlides, XWalletBackup, XSuccessMark, XPasswordSetter] }

    onCreate() {
        this.$button = this.$('button');
        this.$button.addEventListener('click', e => this._onPasswordInput());
        this.addEventListener('x-wallet-backup-complete', e => this._onWalletBackupComplete());
        this.addEventListener('x-password-setter', e => this._onPasswordInput());
        this.addEventListener('x-password-setter-valid', e => this._validityChanged(e.detail));
    }

    _validityChanged(valid) {
        if (valid) {
            this.$button.removeAttribute('disabled');
        } else {
            this.$button.setAttribute('disabled', true);
        }
    }

    _onBeforeEntry() {
        this.$slides._onResize();
    }

    _onEntry() {
        this.$slides.jumpTo(0);
        this.$passwordSetter.value = '';
        this.$passwordSetter.focus();
    }

    async reset() {}

    _onPasswordInput() {
        const password = this.$passwordSetter.value;
        this.fire('x-encrypt-backup', password);
        this.$slides.next();
    }

    async backup(address, privateKey) {
        await this.$walletBackup.backup(address, privateKey);
        this.$slides.next();
    }

    async _onWalletBackupComplete() {
        await this.$slides.next();
        await this.$successMark.animate();
        this.fire('x-file-backup-complete');
    }
}

// Todo: [Max] possibility to not use a password, show heavy warning that it's not for real usage