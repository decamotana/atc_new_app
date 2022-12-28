import { Checkbox, Drawer } from "antd";
import React, { useEffect } from "react";

const TableColumnSettings = ({
    showTableColumnSettings,
    setShowTableColumnSettings,
    localStorageKey
}) => {
    useEffect(() => {
        // console.log('showTableColumnSettings', showTableColumnSettings.data)
        let isMobile = window.matchMedia("only screen and (max-width: 480px)")
            .matches;

        if (!isMobile) {
            localStorage.setItem(
                localStorageKey,
                JSON.stringify(showTableColumnSettings.data)
            );
        }

        return () => {};
    }, [showTableColumnSettings]);
    const handleUpdateColumnSettings = (key, show) => {
        let _columnSettings = showTableColumnSettings.data;
        _columnSettings[key].show = show;
        setShowTableColumnSettings({
            ...showTableColumnSettings,
            data: _columnSettings
        });
    };
    return (
        <Drawer
            title="Table Column Settings"
            placement="right"
            onClose={e =>
                setShowTableColumnSettings({
                    ...showTableColumnSettings,
                    show: false
                })
            }
            visible={showTableColumnSettings.show}
        >
            {showTableColumnSettings.data.map((column, key) => {
                return (
                    <div key={key}>
                        <Checkbox
                            checked={column.show}
                            onChange={e =>
                                handleUpdateColumnSettings(
                                    key,
                                    e.target.checked
                                )
                            }
                        >
                            {column.title}
                        </Checkbox>
                    </div>
                );
            })}
        </Drawer>
    );
};

export default TableColumnSettings;
