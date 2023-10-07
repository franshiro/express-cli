import { PaginationFormatter } from "../../utils/PaginationFormatter";
import { sequelize } from "../../database/models";

export default class CrudService {
  constructor(prefix, model) {
    this.prefix = prefix;
    this.model = model;
  }

  async getAll(data) {
    const pagination = {
      page: 0,
      limit: 0,
    };

    if (data.page && data.limit) {
      pagination.page = data.page;
      pagination.limit = data.limit;
    }

    const offset = (pagination.page - 1) * pagination.limit;
    let where = {};
    let paramsPagination = [];

    let order = "createdAt";
    let sort = "DESC";

    if (data.search) {
      const search = data.search.toLowerCase();
      where = {
        description: sequelize.where(
          sequelize.fn("LOWER", sequelize.col("description")),
          "LIKE",
          `%${search}%`
        ),
      };

      paramsPagination = [
        {
          key: "search",
          value: data.search,
        },
      ];
    }

    const params = {
      where: where,
      order: [[order, sort]],
    };

    if (data.page && data.limit) {
      params.limit = Number(pagination.limit);
      params.offset = offset;
    }

    const countParams = { where: where };

    try {
      const items = await this.model.findAll(params);
      const totalItems = await this.model.count(countParams);

      const paginationInformation = PaginationFormatter(
        pagination,
        totalItems,
        this.prefix,
        paramsPagination
      );

      return {
        items: items,
        paginationInformation: paginationInformation,
      };
    } catch (error) {
      throw error;
    }
  }

  async show(id) {
    try {
      const data = await this.model.findOne({
        where: { id: Number(id) },
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async bulkAdd(data) {
    try {
      console.log("buld create: ", data);
      const created = await this.model.bulkCreate(data);

      return created;
    } catch (error) {
      console.log("error: ", error);
      throw error;
    }
  }

  async add(data) {
    try {
      console.log("data create: ", data);
      const created = await this.model.create(data);

      return created;
    } catch (error) {
      console.log("error: ", error);
      throw error;
    }
  }

  async update(id, data, query) {
    try {
      let whereQuery = { id: Number(id) };
      if (query) {
        whereQuery = {
          ...whereQuery,
          ...query,
        };
      }
      console.log("where query: ", whereQuery);

      const oldData = await this.model.findOne({
        where: whereQuery,
        returning: true,
      });

      if (oldData) {
        const updated = await this.model.update(data, {
          where: whereQuery,
        });

        return updated;
      }

      throw new Error("Update Failed");
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const data = await this.model.findOne({
        where: { id: Number(id) },
      });

      if (data) {
        const deleted = await this.model.destroy({ where: { id: Number(id) } });
        return deleted;
      }
    } catch (error) {
      throw error;
    }
  }

  async findData(data) {
    try {
      return await this.model.findOne({
        where: data,
      });
    } catch (error) {
      throw error;
    }
  }

  async find(data) {
    const params = { desc: data.desc };
    try {
      return await this.model.findOne({
        where: params,
      });
    } catch (error) {
      throw error;
    }
  }

  async checkData(data) {
    try {
      return await this.model.findAll({
        where: data,
        raw: true, // <----------- Magic is here
        nest: true,
      });
    } catch (error) {
      console.log("error; ", error);
      throw error;
    }
  }
}
