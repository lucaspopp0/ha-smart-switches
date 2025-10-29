import { LayoutInstance } from "./models/LayoutInstance"
import { LayoutDefinition } from "./models/LayoutDefinition"
import { DefaultApi } from "./index"
import { createConfiguration } from "./configuration"

// These will be populated by calling fetchLayoutDefinitions()
export let ButtonsByLayout: Record<string, string[]> = {};
export let LayoutDescriptions: Record<string, string> = {};
export let LayoutNames: string[] = [];

let layoutDefinitionsCache: { [key: string]: LayoutDefinition } | null = null;

/**
 * Fetch layout definitions from the backend API
 * This should be called once at app startup
 */
export async function fetchLayoutDefinitions(): Promise<{ [key: string]: LayoutDefinition }> {
    if (layoutDefinitionsCache) {
        return layoutDefinitionsCache;
    }

    const api = new DefaultApi(createConfiguration());
    const definitions = await api.getLayoutDefinitions();

    layoutDefinitionsCache = definitions;

    // Populate ButtonsByLayout, LayoutDescriptions, and LayoutNames from the fetched definitions
    ButtonsByLayout = {};
    LayoutDescriptions = {};
    for (const [version, def] of Object.entries(definitions)) {
        const typedDef = def as LayoutDefinition;
        ButtonsByLayout[version] = typedDef.Buttons || [];
        LayoutDescriptions[version] = typedDef.Description || "";
    }

    LayoutNames = Object.keys(ButtonsByLayout);

    return definitions;
}

export type AnyLayout = LayoutInstance;
