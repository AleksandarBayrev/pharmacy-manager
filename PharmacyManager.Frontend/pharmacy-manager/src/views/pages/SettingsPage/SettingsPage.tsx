import React from "react";
import { computed, Lambda, observe } from "mobx";
import "../../../shared/Styles.css";
import { LanguageSelector } from "../../../shared";
import { ISettingsStore, ITranslationManager } from "../../../types";

type SettingsPageProps = {
    settingsStore: ISettingsStore;
    translationManager: ITranslationManager;
}

export class SettingsPage extends React.Component<SettingsPageProps> {
    private pageTitleObserver!: Lambda;
    componentDidMount = async () => {
        await this.props.settingsStore.load();
        this.pageTitleObserver = observe(this.props.settingsStore.language, () => {
            window.document.title = this.pageTitle;
        });
        window.document.title = this.pageTitle;
    }

    componentWillUnmount = async () => {
        await this.props.settingsStore.unload();
    }
    render() {
        return (
            <div className="App-page">
                <div className="App-page-header">${this.props.translationManager.getTranslation(this.props.settingsStore.language.get(), "HEADER_SETTINGS")}</div>
                <div className='App-page-container'>
                    <div className='App-language-selector-container'>
                        <LanguageSelector
                            store={this.props.settingsStore}
                            translationManager={this.props.translationManager} />
                    </div>
                </div>
            </div>
        )
    }

    @computed
    private get pageTitle() {
        return `Pharmacy Manager - ${this.props.translationManager.getTranslation(this.props.settingsStore.language.get(), "HEADER_SETTINGS")}`;
    }
}