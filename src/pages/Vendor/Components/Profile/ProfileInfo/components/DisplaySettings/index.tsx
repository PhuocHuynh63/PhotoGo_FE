import { Switch } from "@components/Atoms/ui/switch"

interface DisplaySettings {
    showProfile: boolean;
    showLocation: boolean;
    emailNotifications: boolean;
}

interface DisplaySettingsProps {
    settings: DisplaySettings
    onSettingChange: (setting: keyof DisplaySettings, value: boolean) => void
}

export default function DisplaySettings({ settings, onSettingChange }: DisplaySettingsProps) {
    return (
        <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium mb-3">Cài đặt hiển thị</h4>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Hồ sơ công khai</p>
                        <p className="text-sm text-gray-500">Cho phép khách hàng tìm thấy hồ sơ của bạn</p>
                    </div>
                    <Switch
                        checked={settings?.showProfile}
                        onCheckedChange={(checked) => onSettingChange("showProfile", checked)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Hiển thị địa điểm</p>
                        <p className="text-sm text-gray-500">Cho phép khách hàng đặt lịch với bạn</p>
                    </div>
                    <Switch
                        checked={settings?.showLocation}
                        onCheckedChange={(checked) => onSettingChange("showLocation", checked)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Thông báo email</p>
                        <p className="text-sm text-gray-500">Nhận thông báo qua email</p>
                    </div>
                    <Switch
                        checked={settings?.emailNotifications}
                        onCheckedChange={(checked) => onSettingChange("emailNotifications", checked)}
                    />
                </div>
            </div>
        </div>
    )
}

export type { DisplaySettings } 