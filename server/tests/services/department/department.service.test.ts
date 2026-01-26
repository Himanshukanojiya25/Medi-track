import { Types } from "mongoose";
import {
  createDepartmentService,
  getAllDepartmentsService,
  updateDepartmentService,
} from "../../../src/services/department/department.service";
import { DepartmentModel } from "../../../src/models/department";

describe("Department Service", () => {
  const superAdminId = new Types.ObjectId().toHexString();

  /**
   * 🔥 IMPORTANT
   * Global DB reuse hota hai is project me,
   * isliye har test se pehle + baad clean karna mandatory hai
   */
  beforeEach(async () => {
    await DepartmentModel.deleteMany({});
  });

  afterEach(async () => {
    await DepartmentModel.deleteMany({});
  });

  describe("createDepartmentService", () => {
    it("should create a department", async () => {
      const department = await createDepartmentService({
        name: "Cardiology",
        description: "Heart related treatments",
        createdBy: superAdminId,
      });

      expect(department).toBeDefined();
      expect(department.name).toBe("Cardiology");
      expect(department.description).toBe("Heart related treatments");
      expect(department.createdBy).toBeInstanceOf(Types.ObjectId);
    });

    it("should not allow duplicate department", async () => {
      await createDepartmentService({
        name: "Orthopedics",
        createdBy: superAdminId,
      });

      await expect(
        createDepartmentService({
          name: "Orthopedics",
          createdBy: superAdminId,
        })
      ).rejects.toThrow("Department already exists");
    });
  });

  describe("getAllDepartmentsService", () => {
    it("should return all departments sorted by name", async () => {
      await DepartmentModel.create([
        {
          name: "Neurology",
          createdBy: new Types.ObjectId(superAdminId),
        },
        {
          name: "Anesthesiology",
          createdBy: new Types.ObjectId(superAdminId),
        },
      ]);

      const departments = await getAllDepartmentsService();

      expect(departments.length).toBe(2);
      expect(departments[0].name).toBe("Anesthesiology");
      expect(departments[1].name).toBe("Neurology");
    });
  });

  describe("updateDepartmentService", () => {
    it("should update department fields", async () => {
      const created = await DepartmentModel.create({
        name: "Pediatrics",
        createdBy: new Types.ObjectId(superAdminId),
      });

      const updated = await updateDepartmentService(
        created._id.toHexString(),
        {
          description: "Child healthcare",
          isActive: false,
        }
      );

      expect(updated.description).toBe("Child healthcare");
      expect(updated.isActive).toBe(false);
    });

    it("should throw error if department not found", async () => {
      const fakeId = new Types.ObjectId().toHexString();

      await expect(
        updateDepartmentService(fakeId, { name: "Updated" })
      ).rejects.toThrow("Department not found");
    });
  });
});
