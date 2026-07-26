import { useState } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-text">Settings</h2>
        <p className="text-text-muted text-sm mt-1">
          Configure the notification engine
        </p>
      </div>

      {/* General Settings */}
      <section className="bg-surface rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold text-text flex items-center gap-2">
          <Settings className="w-5 h-5 text-text-muted" />
          General
        </h3>

        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">
            Default Retry Attempts
          </label>
          <input
            type="number"
            defaultValue={3}
            min={0}
            max={10}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">
            Idempotency TTL (seconds)
          </label>
          <input
            type="number"
            defaultValue={3600}
            min={60}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">
            Circuit Breaker Threshold
          </label>
          <input
            type="number"
            defaultValue={5}
            min={1}
            max={100}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">
            Circuit Breaker Reset Timeout (ms)
          </label>
          <input
            type="number"
            defaultValue={30000}
            min={1000}
            step={1000}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </section>

      {/* Kafka Settings */}
      <section className="bg-surface rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold text-text">Kafka</h3>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">
            Bootstrap Servers
          </label>
          <input
            type="text"
            defaultValue="localhost:9092"
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">
            Consumer Group ID
          </label>
          <input
            type="text"
            defaultValue="notification-engine"
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </section>

      {/* RabbitMQ Settings */}
      <section className="bg-surface rounded-xl border border-border p-5 space-y-4">
        <h3 className="font-semibold text-text">RabbitMQ</h3>
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1">
            Connection URL
          </label>
          <input
            type="text"
            defaultValue="amqp://localhost:5672"
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </section>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-success">
            <CheckCircle2 className="w-4 h-4" />
            Settings saved
          </span>
        )}
      </div>
    </div>
  );
}