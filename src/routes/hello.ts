import { FastifyInstance } from 'fastify';
import { success } from '../utils';

export default (fastify: FastifyInstance, _: any, done: any) => {
  fastify.get<{
    Body: {
      email: string;
      show_mine?: boolean;
      project_name?: string;
      page?: number;
      size?: number;
    };
  }>('/world', async (req, res) => res.send(success({ msg: 'hello world' })));

  done();
};
