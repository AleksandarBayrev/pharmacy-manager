import { computed, Lambda, observe } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import "../../../shared/Styles.css";
import { IAppStore, ITranslationManager } from "../../../types";

type HomePageProps = {
    translationManager: ITranslationManager;
    appStore: IAppStore;
}

@observer
export class HomePage extends React.Component<HomePageProps> {
    private pageTitleObserver!: Lambda;
    componentDidMount = async () => {
      await this.props.appStore.load();
      this.props.appStore.setCurrentPage(window.location.pathname);
      this.pageTitleObserver = observe(this.props.appStore.language, () => {
          window.document.title = this.pageTitle;
      });
      window.document.title = this.pageTitle;
    }
  
    componentWillUnmount = async () => {
      this.pageTitleObserver();
      await this.props.appStore.unload();
    }
    render(): React.ReactNode {
        return (
            <div className="App-page">
                <div className="App-page-header">{this.props.translationManager.getTranslation(this.props.appStore.language.get(), "HOME_PAGE_HEADER_CONTENT")}</div>
            </div>
        );
    }

    @computed
    private get pageTitle() {
        return `Pharmacy Manager - ${this.props.translationManager.getTranslation(this.props.appStore.language.get(), "HEADER_HOME")}`;
    }
}