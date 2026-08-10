import React, { useRef, useState } from "react";
import * as XLSX from "xlsx";

type UploadRow = {
  name: string;
  email: string;
  mobile: string;
  password: string;
  childName: string;
  childAge: string;
  childGrade: string;
  subject: string;
};

type ValidationError = {
  row: number;
  message: string;
};

const REQUIRED_COLUMNS = [
  "name",
  "email",
  "mobile",
  "password",
  "childName",
  "childAge",
  "childGrade",
  "subject",
];

const BulkUploadUsers: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<UploadRow[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isReading, setIsReading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">(
    ""
  );

  const normalizeHeader = (value: unknown) => {
    return String(value ?? "")
      .trim()
      .replace(/\s+/g, "")
      .toLowerCase();
  };

  const normalizeRow = (row: Record<string, unknown>): UploadRow => {
    const normalized: Record<string, string> = {};

    Object.keys(row).forEach((key) => {
      normalized[normalizeHeader(key)] = String(row[key] ?? "").trim();
    });

    return {
      name: normalized["name"] || "",
      email: normalized["email"] || "",
      mobile: normalized["mobile"] || "",
      password: normalized["password"] || "",
      childName: normalized["childname"] || "",
      childAge: normalized["childage"] || "",
      childGrade: normalized["childgrade"] || "",
      subject: normalized["subject"] || "",
    };
  };

  const validateRows = (data: UploadRow[]) => {
    const validationErrors: ValidationError[] = [];

    const emailSet = new Set<string>();

    data.forEach((row, index) => {
      const excelRow = index + 2;

      if (!row.name) {
        validationErrors.push({
          row: excelRow,
          message: "User name is required.",
        });
      }

      if (!row.email) {
        validationErrors.push({
          row: excelRow,
          message: "Email is required.",
        });
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(row.email)) {
          validationErrors.push({
            row: excelRow,
            message: `Invalid email: ${row.email}`,
          });
        }

        const normalizedEmail = row.email.toLowerCase();

        if (emailSet.has(normalizedEmail)) {
          validationErrors.push({
            row: excelRow,
            message: `Duplicate email in Excel: ${row.email}`,
          });
        }

        emailSet.add(normalizedEmail);
      }

      if (!row.mobile) {
        validationErrors.push({
          row: excelRow,
          message: "Mobile number is required.",
        });
      }

      if (!row.password) {
        validationErrors.push({
          row: excelRow,
          message: "Password is required.",
        });
      }

      if (!row.childName) {
        validationErrors.push({
          row: excelRow,
          message: "Child name is required.",
        });
      }

      if (!row.childAge) {
        validationErrors.push({
          row: excelRow,
          message: "Child age is required.",
        });
      }

      if (!row.childGrade) {
        validationErrors.push({
          row: excelRow,
          message: "Child grade is required.",
        });
      }

      if (!row.subject) {
        validationErrors.push({
          row: excelRow,
          message: "Subject is required.",
        });
      }
    });

    return validationErrors;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setMessage("");
    setMessageType("");
    setErrors([]);
    setRows([]);
    setFileName(file.name);
    setIsReading(true);

    try {
      const extension = file.name
        .split(".")
        .pop()
        ?.toLowerCase();

      if (!["xlsx", "xls", "csv"].includes(extension || "")) {
        throw new Error(
          "Please select a valid Excel file (.xlsx, .xls) or CSV file."
        );
      }

      const buffer = await file.arrayBuffer();

      const workbook = XLSX.read(buffer, {
        type: "array",
      });

      if (!workbook.SheetNames.length) {
        throw new Error("The selected file does not contain any worksheet.");
      }

      const firstSheetName = workbook.SheetNames[0];

      const worksheet = workbook.Sheets[firstSheetName];

      const rawData = XLSX.utils.sheet_to_json<Record<string, unknown>>(
        worksheet,
        {
          defval: "",
        }
      );

      if (!rawData.length) {
        throw new Error("The selected Excel file is empty.");
      }

      /*
       * Check required columns before processing rows.
       */
      const actualHeaders = Object.keys(rawData[0]).map(normalizeHeader);

      const missingColumns = REQUIRED_COLUMNS.filter(
        (requiredColumn) =>
          !actualHeaders.includes(normalizeHeader(requiredColumn))
      );

      if (missingColumns.length) {
        throw new Error(
          `Missing required column(s): ${missingColumns.join(", ")}`
        );
      }

      const normalizedRows = rawData.map(normalizeRow);

      const validationErrors = validateRows(normalizedRows);

      setRows(normalizedRows);
      setErrors(validationErrors);

      if (validationErrors.length) {
        setMessage(
          `${validationErrors.length} validation error(s) found. Please correct the Excel file before uploading.`
        );

        setMessageType("error");
      } else {
        setMessage(
          `${normalizedRows.length} user record(s) are ready to upload.`
        );

        setMessageType("success");
      }
    } catch (error) {
      setRows([]);
      setErrors([]);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to read the selected file.";

      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setIsReading(false);
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        name: "Rahul Sharma",
        email: "rahul@example.com",
        mobile: "9876543210",
        password: "Rahul@123",
        childName: "Aarav Sharma",
        childAge: "10",
        childGrade: "5",
        subject: "Mathematics",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Users"
    );

    XLSX.writeFile(
      workbook,
      "bulk-user-upload-template.xlsx"
    );
  };

  const handleUpload = async () => {
    if (!rows.length) {
      setMessage("Please select a valid Excel file first.");
      setMessageType("error");
      return;
    }

    if (errors.length) {
      setMessage(
        "Please fix all Excel validation errors before uploading."
      );
      setMessageType("error");
      return;
    }

    setIsUploading(true);
    setMessage("");
    setMessageType("");

    try {
      /*
       * IMPORTANT:
       *
       * We are intentionally keeping the API URL configurable.
       * Replace this endpoint only if your backend route uses
       * a different path.
       */
      const apiBaseUrl =
        import.meta.env.VITE_API_URL ||
        "https://school-demo-backend.onrender.com";

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

      const response = await fetch(
        `${apiBaseUrl}/users/bulk-upload`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
          body: JSON.stringify({
            users: rows,
          }),
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.error ||
            "Bulk user upload failed."
        );
      }

      setMessage(
        result?.message ||
          `${rows.length} user(s) uploaded successfully.`
      );

      setMessageType("success");

      setRows([]);
      setErrors([]);
      setFileName("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Bulk upload failed.";

      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full p-5">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-xl font-semibold text-gray-800">
            Bulk User Upload
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Upload users and one child for each user using an
            Excel or CSV file.
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Required fields */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Required Excel Columns
            </h3>

            <div className="flex flex-wrap gap-2">
              {REQUIRED_COLUMNS.map((column) => (
                <span
                  key={column}
                  className="px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs text-gray-700"
                >
                  {column}
                </span>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 mb-5">
            <button
              type="button"
              onClick={downloadTemplate}
              className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium"
            >
              Download Excel Template
            </button>

            <label className="cursor-pointer px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium">
              {isReading
                ? "Reading File..."
                : "Choose Excel File"}

              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleFileChange}
                disabled={isReading || isUploading}
              />
            </label>
          </div>

          {/* Selected file */}
          {fileName && (
            <div className="mb-5 p-3 rounded-lg bg-gray-50 border border-gray-200 text-sm">
              <strong>Selected file:</strong>{" "}
              {fileName}
            </div>
          )}

          {/* Message */}
          {message && (
            <div
              className={`mb-5 p-4 rounded-lg text-sm ${
                messageType === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-red-700 mb-3">
                Validation Errors
              </h3>

              <div className="max-h-60 overflow-y-auto border border-red-200 rounded-lg">
                {errors.map((error, index) => (
                  <div
                    key={`${error.row}-${index}`}
                    className="px-4 py-2 text-sm border-b last:border-b-0 border-red-100 text-red-700"
                  >
                    <strong>Row {error.row}:</strong>{" "}
                    {error.message}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview */}
          {rows.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Preview ({rows.length} record
                {rows.length !== 1 ? "s" : ""})
              </h3>

              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        Name
                      </th>

                      <th className="px-4 py-3 text-left">
                        Email
                      </th>

                      <th className="px-4 py-3 text-left">
                        Mobile
                      </th>

                      <th className="px-4 py-3 text-left">
                        Child
                      </th>

                      <th className="px-4 py-3 text-left">
                        Age
                      </th>

                      <th className="px-4 py-3 text-left">
                        Grade
                      </th>

                      <th className="px-4 py-3 text-left">
                        Subject
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.slice(0, 20).map((row, index) => (
                      <tr
                        key={index}
                        className="border-t border-gray-100"
                      >
                        <td className="px-4 py-3">
                          {row.name}
                        </td>

                        <td className="px-4 py-3">
                          {row.email}
                        </td>

                        <td className="px-4 py-3">
                          {row.mobile}
                        </td>

                        <td className="px-4 py-3">
                          {row.childName}
                        </td>

                        <td className="px-4 py-3">
                          {row.childAge}
                        </td>

                        <td className="px-4 py-3">
                          {row.childGrade}
                        </td>

                        <td className="px-4 py-3 font-medium">
                          {row.subject}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {rows.length > 20 && (
                <p className="text-xs text-gray-500 mt-2">
                  Showing first 20 records only. All{" "}
                  {rows.length} records will be uploaded.
                </p>
              )}
            </div>
          )}

          {/* Upload */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleUpload}
              disabled={
                isUploading ||
                isReading ||
                !rows.length ||
                errors.length > 0
              }
              className="px-6 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium"
            >
              {isUploading
                ? "Uploading..."
                : "Upload User List"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadUsers;
