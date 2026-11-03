import { registerDictionaries } from "@/lib/i18n/provider";
import { getDictionary } from "@/lib/i18n/dictionaries";

// En production le layout fournit le dictionnaire de la page ; les tests rendent
// les composants isolément et s'appuient sur ces dictionnaires de repli.
registerDictionaries({ fr: getDictionary("fr"), en: getDictionary("en") });
