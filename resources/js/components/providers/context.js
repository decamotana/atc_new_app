import { createContext } from "react";
import { defaultTabSettings } from "./defaultTabSettings";

const Context = createContext({
    clearent_boarding_nav_settings: defaultTabSettings,
    boarding_active_tab: "1"
});

export default Context;
