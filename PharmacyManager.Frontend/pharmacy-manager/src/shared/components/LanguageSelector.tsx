import React from "react";
import { ILanguageSelectorStore, ITranslationManager, Language } from "../../types";

type LanguageSelectorProps = {
    store: ILanguageSelectorStore;
    translationManager: ITranslationManager;
}

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
                    <option value={Language.Bulgarian}>Bulgarian</option>
                    <option value={Language.English}>English</option>
                </select>
            </div>
        )
    }

    private onLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.props.store.selectLanguage(e.target.value as Language);
    }
}