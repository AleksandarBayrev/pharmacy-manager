import { observer } from "mobx-react";
import React from "react";
import { IAppStore, ITranslationManager, Language } from "../../types";

type LanguageSelectorProps = {
    appStore: IAppStore;
    translationManager: ITranslationManager;
}

@observer
export class LanguageSelector extends React.Component<LanguageSelectorProps> {
    async componentDidMount() {
        await this.props.appStore.load();
    }

    async componentWillUnmount() {
        await this.props.appStore.unload();
    }

    render(): React.ReactNode {
        return (
            <div className="App-language-selector">
                <select onChange={this.onLanguageChange}>
                    <option value={Language.Bulgarian} selected={this.props.appStore.language.get() === Language.Bulgarian}>{this.props.translationManager.getTranslation(this.props.appStore.language.get(), "LANG_BULGARIAN")}</option>
                    <option value={Language.English} selected={this.props.appStore.language.get() === Language.English}>{this.props.translationManager.getTranslation(this.props.appStore.language.get(), "LANG_ENGLISH")}</option>
                </select>
            </div>
        )
    }

    private onLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.props.appStore.selectLanguage(e.target.value as Language);
    }
}