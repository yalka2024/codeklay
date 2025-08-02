import { Test, type TestingModule } from "@nestjs/testing"
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import { ConflictException, UnauthorizedException } from "@nestjs/common"
// import { AuthService } from "../api/auth/auth.service"
// import { PrismaService } from "../api/database/prisma.service"
// import { UserService } from "../api/users/user.service"
import * as bcrypt from "bcryptjs"

describe("AuthService", () => {
  describe("register", () => {
    // Empty
  })

  describe("login", () => {
    // Empty
  })
})