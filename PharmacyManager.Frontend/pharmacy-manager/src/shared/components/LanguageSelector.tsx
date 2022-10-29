import { observer } from "mobx-react";
import React from "react";
import { ILanguageSelectorStore, ITranslationManager, Language } from "../../types";

type LanguageSelectorProps = {
    store: ILanguageSelectorStore;
    translationManager: ITranslationManager;
}

@observer
export class LanguageSelector extends React.Component<LanguageSelectorProps> {
    async componentDidMount() {
        await this.props.store.load();
    }

    async componentWillUnmount() {
        await this.props.store.unload();
    }

    render(): React.ReactNode {
        return (
            <div className="App-language-selector">
                <select onChange={this.onLanguageChange}>
                    <option value={Language.Bulgarian} selected={this.props.store.language.get() === Language.Bulgarian}>{this.props.translationManager.getTranslation(this.props.store.language.get(), "LANG_BULGARIAN")}</option>
                    <option value={Language.English} selected={this.props.store.language.get() === Language.English}>{this.props.translationManager.getTranslation(this.props.store.language.get(), "LANG_ENGLISH")}</option>
                </select>
            </div>
        )
    }

    private onLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.props.store.selectLanguage(e.target.value as Language);
    }
}