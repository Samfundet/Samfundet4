import { useMemo, useState } from "react";
import { InputField } from "~/Components/InputField/InputField";
import { EventDto } from "~/dto";
import styles from '../EventCreatorAdminPage.module.scss'
import { dbT } from "~/utils";
import { useTranslation } from "react-i18next";

type EventTemplateSearchProp = {
  events: EventDto[];
  onSelectEvent: (event: EventDto) => void;
};

export function EventTemplateSearch({ events, onSelectEvent }: EventTemplateSearchProp) {
    const { t, i18n } = useTranslation();
    const [query, setQuery] = useState('');
    const filteredEvents = useMemo(() =>{
        const normalizedSearch = query.trim().toLowerCase();
        if (normalizedSearch === '') return [];
        const keywords = normalizedSearch.split(' ');
        return events.filter((event) => {
              const title = (dbT(event, 'title', i18n.language) as string)?.toLowerCase() ?? '';
              return keywords.every((kw) => title.includes(kw));
        });
    }, [events, query, i18n.language]);
    // TODO: add translations
    return (
        <div className={styles.create_from_existing_event}>
        <InputField
            icon="mdi:search"
            labelClassName={styles.search_bar}
            inputClassName={styles.search_bar_field}
            onChange={setQuery}
            value={query}
            placeholder="Search for an existing event"
        />
        {filteredEvents.length > 0 && (
            <div>
                {filteredEvents.slice(0, 5).map((e) => (
                    <button key={e.id} type="button"
                    className={styles.search_result_item}
                    onClick={() => onSelectEvent(e)} >
                        {dbT(e, 'title')}
                    </button>
                ))}
            </div>
        )}
        </div>
    );
}