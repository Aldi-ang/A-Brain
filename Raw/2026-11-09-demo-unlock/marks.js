/* after the unlock: the unlock keys are gone and the menu foot says the vault is open */
return { unlockKeys: document.querySelectorAll('[data-guide="unlock"]').length, vaultOpen: document.querySelectorAll('[data-vault="open"]').length, markUnlock: document.querySelectorAll('[data-mark="unlock"]').length };
