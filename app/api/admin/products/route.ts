import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/lib/models/ProductModel";

export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: "unauthorized" },
      {
        status: 401,
      }
    );
  }
  await dbConnect();
  const products = await ProductModel.find();
  return Response.json(products);
}) as any;

export const POST = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: "unauthorized" },
      {
        status: 401,
      }
    );
  }

  try {
    const body = await req.text(); // Read the raw request body as text

    if (!body) {
      return Response.json(
        { message: "Empty request body" },
        {
          status: 400,
        }
      );
    }

    const {
      name,
      slug,
      price,
      category,
      image,
      brand,
      countInStock,
      description,
    } = JSON.parse(body);

    await dbConnect();
    const product = new ProductModel({
      name,
      slug,
      price,
      category,
      image,
      brand,
      countInStock,
      description,
    });

    await product.save();
    return Response.json(
      { message: "Product created successfully", product },
      {
        status: 201,
      }
    );
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    );
  }
}) as any;
