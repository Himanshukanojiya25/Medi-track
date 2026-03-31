import { prisma } from "../../lib/prisma";

export class DoctorProfileService {
  /**
   * Get complete doctor profile with all details
   */
  static async getCompleteProfile(doctorId: string) {
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            phone: true,
          },
        },
        hospital: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            state: true,
            country: true,
            pincode: true,
            image: true,
            phone: true,
          },
        },
        specializations: {
          select: {
            id: true,
            name: true,
            description: true,
            icon: true,
          },
        },
        qualifications: {
          orderBy: {
            year: 'desc',
          },
        },
        availabilities: {
          where: {
            isAvailable: true,
            date: {
              gte: new Date(),
            },
          },
          orderBy: {
            date: 'asc',
          },
          take: 7,
        },
        _count: {
          select: {
            reviews: true,
            appointments: true,
          },
        },
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    // Get reviews separately with pagination
    const reviews = await prisma.review.findMany({
      where: {
        doctorId,
      },
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        patient: {
          select: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // Calculate ratings
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = reviews.length > 0 
      ? Number((totalRating / reviews.length).toFixed(1))
      : 0;

    // Calculate rating distribution
    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };

    return {
      id: doctor.id,
      user: doctor.user,
      hospital: doctor.hospital,
      specializations: doctor.specializations,
      qualifications: doctor.qualifications,
      experience: doctor.experience,
      bio: doctor.bio,
      fee: doctor.fee,
      videoConsultFee: doctor.videoConsultFee,
      isVideoConsultAvailable: doctor.isVideoConsultAvailable,
      registrationNumber: doctor.registrationNumber,
      registrationCouncil: doctor.registrationCouncil,
      registrationYear: doctor.registrationYear,
      availabilities: doctor.availabilities,
      reviews,
      stats: {
        averageRating,
        totalReviews: doctor._count.reviews,
        totalPatients: doctor._count.appointments,
        ratingDistribution,
      },
    };
  }

  /**
   * Get basic doctor information
   */
  static async getBasicInfo(doctorId: string) {
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        hospital: {
          select: {
            name: true,
            city: true,
          },
        },
        specializations: {
          take: 1,
          select: {
            name: true,
          },
        },
      },
    });

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    return {
      id: doctor.id,
      name: doctor.user.name,
      image: doctor.user.image,
      specialization: doctor.specializations[0]?.name,
      hospital: doctor.hospital.name,
      location: doctor.hospital.city,
      experience: doctor.experience,
    };
  }

  /**
   * Get doctor specializations
   */
  static async getSpecializations(doctorId: string) {
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: {
        specializations: true,
      },
    });

    return doctor?.specializations || [];
  }

  /**
   * Get doctor qualifications
   */
  static async getQualifications(doctorId: string) {
    const qualifications = await prisma.qualification.findMany({
      where: { doctorId },
      orderBy: {
        year: 'desc',
      },
    });

    return qualifications;
  }

  /**
   * Get doctor availability slots
   */
  static async getAvailability(doctorId: string) {
    const availabilities = await prisma.availability.findMany({
      where: {
        doctorId,
        isAvailable: true,
        date: {
          gte: new Date(),
        },
      },
      orderBy: {
        date: 'asc',
      },
      take: 7,
    });

    // Group by date
    const groupedByDate = availabilities.reduce((acc, curr) => {
      const dateStr = curr.date.toISOString().split('T')[0];
      if (!acc[dateStr]) {
        acc[dateStr] = {
          date: curr.date,
          slots: [],
        };
      }
      acc[dateStr].slots.push({
        id: curr.id,
        startTime: curr.startTime,
        endTime: curr.endTime,
        type: curr.type,
      });
      return acc;
    }, {});

    return Object.values(groupedByDate);
  }

  /**
   * Get doctor reviews with pagination
   */
  static async getReviews(doctorId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { doctorId },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          patient: {
            select: {
              user: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      }),
      prisma.review.count({
        where: { doctorId },
      }),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get doctor statistics
   */
  static async getStats(doctorId: string) {
    const [reviews, appointments] = await Promise.all([
      prisma.review.findMany({
        where: { doctorId },
        select: { rating: true },
      }),
      prisma.appointment.count({
        where: { doctorId },
      }),
    ]);

    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = reviews.length > 0 
      ? Number((totalRating / reviews.length).toFixed(1))
      : 0;

    return {
      averageRating,
      totalReviews: reviews.length,
      totalPatients: appointments,
      ratingDistribution: {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length,
      },
    };
  }
}