import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

type SettingsSelectProps = {
    disabled?: boolean;
    onChange: (value: any) => void;
    options: { label: string; value: any }[];
    value: any;
};

export const SettingsSelectInput = ({
    disabled = false,
    value,
    onChange,
    options,
}: SettingsSelectProps) => {
    return (
        <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger className="w-[200px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => {
                    return (
                        <SelectItem value={option.value}>
                            {option.label}
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
};

type SettingNumberProps = {
    disabled?: boolean;
    onChange: (value: any) => void;
    value: any;
};

export const SettingsNumberInput = ({
    disabled = false,
    onChange,
    value,
}: SettingNumberProps) => {
    const [Value, SetValue] = useState(value);

    useEffect(() => {
        let timeout = setTimeout(() => {
            onChange(Value);
        }, 2000);

        return () => {
            clearTimeout(timeout);
        };
    }, [Value]);

    return (
        <Input
            type="number"
            className="w-[200px]"
            value={Value}
            onChange={(ev) => SetValue(parseInt(ev.target.value))}
            disabled={disabled}
        />
    );
};
