import { PLUGIN_ID as pluginId } from './pluginId';
import { Initializer } from './components/Initializer';
import PluginIcon from './components/PluginIcon';
import getTrad from './utils/getTrad';
import pluginPkg from '../../package.json';
import { prefixPluginTranslations } from './utils/prefixPluginTranslations';
const name = pluginPkg.strapi.name;

export default {
  register(app: any) {
    app.customFields.register({
      name: 'icon',
      pluginId,
      icon: PluginIcon,
      type: 'string',
      intlLabel: {
        id: getTrad('label'),
        defaultMessage: 'Icon Picker',
      },
      intlDescription: {
        id: getTrad('description'),
        defaultMessage: 'Select an icon',
      },
      components: {
        Input: async () =>
          import(
            /* webpackChunkName: "icon-picker-input-component" */ './components/ReactIconsSelector'
          ),
      },
      options: {
        advanced: [
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: getTrad('options.advanced.requiredField'),
                  defaultMessage: 'Required field',
                },
                description: {
                  id: getTrad('options.advanced.requiredField.description'),
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
              },
            ],
          },
        ],
      },
    });
    app.addMenuLink({
      to: `plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: name,
      },
      Component: async () => {
        const { App } = await import('./pages/App');

        return App;
      },
      permissions: [
        {
          action: 'plugin::icon-picker.read',
          subject: null,
        },
      ],
    });

    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    const importedTrads = await Promise.all(
      (locales as any[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data,
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
