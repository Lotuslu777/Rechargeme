import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { AuthOptions } from 'next-auth';

// 简单的认证处理程序 - MVP阶段使用内存存储
// 生产环境建议添加更多认证提供商，如GitHub、Google等
export const authOptions: AuthOptions = {
  // 暂时不使用适配器，使用默认的JSON Web Token
  providers: [
    CredentialsProvider({
      name: 'RechargeMe账号',
      credentials: {
        email: { label: '邮箱', type: 'email', placeholder: 'hello@example.com' },
        password: { label: '密码', type: 'password' },
      },
      async authorize(credentials) {
        // MVP阶段简化认证流程，仅进行基本验证
        if (!credentials?.email) return null;

        console.log('Authorizing user:', credentials.email);

        // 在MVP阶段，我们允许任何邮箱直接登录
        // 生产环境请替换为实际的用户验证逻辑
        const user = {
          id: credentials.email,
          email: credentials.email,
          name: credentials.email.split('@')[0],
        };

        console.log('User authorized:', user);
        return user;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    session: ({ session, token }: { session: Session; token: JWT }) => {
      console.log('Session callback - token:', token);
      console.log('Session callback - session before:', session);
      
      const newSession = {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          email: token.email,
        },
      };
      
      console.log('Session callback - session after:', newSession);
      return newSession;
    },
    jwt: ({ token, user }) => {
      console.log('JWT callback - user:', user);
      console.log('JWT callback - token before:', token);
      
      if (user) {
        token.sub = user.id;
        token.email = user.email;
      }
      
      console.log('JWT callback - token after:', token);
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 