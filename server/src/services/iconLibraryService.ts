import { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async find(query) {
    return await strapi.entityService.findMany('plugin::icon-picker.iconlibrary', query);
  },
  async create(data) {
    return await strapi.entityService.create('plugin::icon-picker.iconlibrary', data);
  },
  async update(id, data) {
    return await strapi.entityService.update('plugin::icon-picker.iconlibrary', id, data);
  },
  async delete(id) {
    return await strapi.entityService.delete('plugin::icon-picker.iconlibrary', id);
  },
});
