import { useMemo, useState } from "react";
import { InputField } from "~/Components/InputField/InputField";
import { EventDto } from "~/dto";
import styles from '../EventCreatorAdminPage.module.scss'
import { dbT } from "~/utils";
import { useTranslation } from "react-i18next";
import { KEY } from '~/i18n/constants';

type EventTemplateSearchProp = {
  events: EventDto[];
  onSelectEvent: (event: EventDto) => void;
};

export function EventTemplateSearch({ events, onSelectEvent }: EventTemplateSearchProp) {
    const { t, i18n } = useTranslation();
    const [query, setQuery] = useState('');
    const [selectedEvent, SetSelectedEvent] = useState<EventDto | null>(null);
    const filteredEvents = useMemo(() =>{
        const normalizedSearch = query.trim().toLowerCase();
        if (normalizedSearch === '') return [];
        const keywords = normalizedSearch.split(/\s+/);
        return events.filter((event) => {
              const title = (dbT(event, 'title', i18n.language) as string)?.toLowerCase() ?? '';
              return keywords.every((kw) => title.includes(kw));
        });
    }, [events, query, i18n.language]);
    const showResults = query.trim() !== '' && selectedEvent === null && filteredEvents.length > 0;
    // TODO: add translations

    function handleChange(value: string) {
        setQuery(value);

        const selectedTitle = selectedEvent ? ((dbT(selectedEvent, 'title', i18n.language) as string) ?? '') : '';
        if (value !== selectedTitle) {
            SetSelectedEvent(null);
        }
    }

    return (
        <div className={styles.create_from_existing_event}>
            <InputField
                icon="mdi:search"
                inputClassName={styles.search_bar_field}
                onChange={handleChange}
                value={query}
                placeholder={t(KEY.event_search_for_an_existing_event)}
            />
            {selectedEvent && (
                <div className={styles.selected_event_info}>
                    <span className={styles.selected_event_text}>
                    {t(KEY.event_selected_existing_event)}:{" "}
                    <strong>{dbT(selectedEvent, 'title', i18n.language)}</strong>
                    {" · "}
                    {new Date(selectedEvent.start_dt).toLocaleDateString(i18n.language)}
                    </span>
                </div>
            )}
            {showResults && (
                <div className={styles.search_results}>
                    {filteredEvents.map((e) => (
                        <button 
                            key={e.id} 
                            type="button"
                            className={styles.search_result_item}
                            onClick={() => {
                                onSelectEvent(e);
                                SetSelectedEvent(e);
                                setQuery((dbT(e, 'title', i18n.language) as string) ?? '');
                            }} 
                        >
                            <span className={styles.search_result_title}>
                                {dbT(e, 'title', i18n.language)}
                            </span>
                            <span className={styles.search_result_meta}>
                                {new Date(e.start_dt).toLocaleDateString(i18n.language)}
                            </span>
                        </button>

                    ))}
                </div>
            )}
        </div>
    );
}