# API_SPEC

- description : sebuah API yang digunakan untuk melakukan approval ketika pembuatan order dengan layer user yang berbeda beda posisinya

## ENDPOINTS

- [Auth](#auth)

  - POST /login
  - POST /confirm-otp
  - PATCH /logout

- [Products](#products)

  - GET /products
  - GET /products/download-template
  - GET /products/{id}
  - PATCH /products/{id}
  - DELETE /products/{id}

- [Orders](#orders)

  - GET /orders
  - POST /orders
  - POST /orders/actions
  - GET /orders/{id}

- [Tags](#tags)

  - GET /tags
  - GET /tags/{id}
  - PUT /tags/{id}

- [Public](#public)

  - GET /public/images/{fileName}

## Auth

### POST /login

summary: Untuk Masuk dan mendapatkan OTP

Request:

- body

```json
{
  "username": "String"
}
```

Response:

- "SUCCESS SENT OTP" ( _200_ )

```json
{
  "statusCode": "Integer",
  "status": "String",
  "payload": {
    "email": "String"
  }
}
```

- "ERROR"
  - ( _400_ )
  - ( _404_ )

```json
{
  "statusCode": "Integer",
  "status": "ERROR",
  "payload": {
    "ErrorMessage": "String"
  }
}
```

### POST /confirm-otp

summary: Mengkonfirmasi OTP yang dikirimkan user

Request:

- body

```json
{
  "email": "String",
  "OTP": "String"
}
```

Response:

- "SUCCESS CONFIRM OTP" ( _200_ )

```json
{
  "statusCode": "Integer",
  "status": "String",
  "payload": {
    "email": "String",
    "accessToken": "String",
    "exp": "Integer",
    "access": [
      {
        "id": "Integer",
        "workflow": "String",
        "..."
      }
      "..."
    ]
  }
}
```

- "ERROR"
  - ( _400_ )
  - ( _401_ )
  - ( _404_ )
  - ( _419_ )

```json
{
  "statusCode": "Integer",
  "status": "ERROR",
  "payload": {
    "ErrorMessage": "String"
  }
}
```

### PATCH /logout

summary: mengeluarkan access user

Request:

- headers

```json
{
  "authorization": "String"
}
```

Response:

- "SUCCESS LOGOUT" ( _200_ )

```json
{
  "statusCode": "Integer",
  "status": "String",
  "payload": null
}
```

- "ERROR"
  - ( _403_ )

```json
{
  "statusCode": "Integer",
  "status": "ERROR",
  "payload": {
    "ErrorMessage": "String"
  }
}
```

## Products

### GET /products

summary: Mendapatkan products

Request:

- headers

```json
{
  "authorization": "String"
}
```

- params

```json
{
  "limit": "String",
  "skip": "String"
}
```

Response:

- "SUCCESS GET PRODUCTS" ( _200_ )

```json
{
  "statusCode": "Integer",
  "status": "String",
  "payload": {
    "count": "Integer",
    "data": [
      {
        "id": "Integer",
        "name": "String",
        "Description": "String",
        "imgUrl": "String",
        "..."
      },
      "..."
    ],
    "limit": "Integer",
    "skip": "Integer",
  }
}
```

### GET /products/download-template

summary: Mendapatkan File template untuk menginput products

Request:

- headers

```json
{
  "authorization": "String"
}
```

Response:

- ( _200_ )

```json
{
  "file": ".xlsx"
}
```

### GET /products/{id}

summary: Mendapatkan product berdasarkan id

Request:

- headers

```json
{
  "authorization": "String"
}
```

- params

```json
{
  "id": "String"
}
```

Response:

- "SUCCESS GET PRODUCT" ( _200_ )

```json
{
  "statusCode": "Integer",
  "status": "String",
  "payload":
  {
    "data": {
        "id": "Integer",
        "name": "String",
        "Description": "String",
        "imgUrl": "String",
        "..."
    },
  }
}
```

- "ERROR"
  - ( _404_ )

```json
{
  "statusCode": "Integer",
  "status": "ERROR",
  "payload": {
    "ErrorMessage": "String"
  }
}
```

### PATCH /products/{id}

Summary: Update image pada entity product. image akan disimpan pada server

Request:

- headers

```json
{
  "authorization": "String"
}
```

- params

```json
{
  "id": "String"
}
```

- formData

```json
{
  "type": [".jpg", ".jpeg", ".png"],
  "image": "files"
}
```

Response:

- "SUCCESS UPDATE PRODUCT" ( _200_ )

```json
{
  "statusCode": "Integer",
  "status": "String",
  "payload":
  {
    "data": {
        "id": "Integer",
        "name": "String",
        "Description": "String",
        "imgUrl": "String",
        "..."
    },
  }
}
```

- "ERROR"
  - ( _404_ )
  - ( _413_ ) **size must be less than 5MB**
  - ( _422_ ) **format must be jpg, jpeg, png**

```json
{
  "statusCode": "Integer",
  "status": "ERROR",
  "payload": {
    "ErrorMessage": "String"
  }
}
```

### DELETE /products/{id}

Summary: Menghapus Product

Request:

- headers

```json
{
  "authorization": "String"
}
```

- params

```json
{
  "id": "String"
}
```

Response:

- "SUCCESS DELETE PRODUCT" ( _200_ )

```json
{
  "statusCode": "Integer",
  "status": "String",
  "payload":
  {
    "data": {
        "id": "Integer",
        "name": "String",
        "Description": "String",
        "imgUrl": "String",
        "..."
    },
  }
}
```

- "ERROR"
  - ( _404_ )

```json
{
  "statusCode": "Integer",
  "status": "ERROR",
  "payload": {
    "ErrorMessage": "String"
  }
}
```

## Orders

### GET /orders

Summary: Mendapat Orders disesuaikan dengan tipe service

Request:

- headers

```json
{
  "authorization": "String"
}
```

- params

```json
{
  "typeService": "String => 'owner', 'done', 'modify', 'approval'",
  "limit": "String",
  "skip": "String"
}
```

Response:

- "SUCCESS GET ORDERS, TYPE: typeService" ( _200_ )

```json
{
  "statusCode": "Integer",
  "status": "String",
  "payload":
  {
    "data": [
      {
        "id": "Integer",
        "name": "String",
        "Description": "String",
        "imgUrl": "String",
        "..."
      },
      "..."
    ],
    "count": "Integer",
    "limit": "Integer",
    "skip": "Integer"
  }
}
```

### POST /orders

Summary: Membuat Order baru dengan menyimpan entiti orders dan products

Request:

- headers

```json
{
  "authorization": "String"
}
```

- body

```json
{
  "workflowId": "Integer"
}
```

- formData

```json
{
  "type": [".xlsx", ".xls"],
  "docs": "files"
}
```

Response:

- "SUCCESS CREATE ORDER" ( _201_ )

```json
{
  "statusCode": "Integer",
  "status": "String",
  "payload": {
    "data": [
      {
        "ProductId": "Interger",
        "OrderId": "Integer",
        "StageId": "Integer"
      },
      "..."
    ]
  }
}
```

- "ERROR"
  - ( _400_ )
  - ( _400_ ) **INVALID TAGID NUMBER {TAGID}**
  - ( _404_ )
  - ( _422_ ) **FORMAT MUST BE XLSX, XLS**

```json
{
  "statusCode": "Integer",
  "status": "ERROR",
  "payload": {
    "ErrorMessage": "String"
  }
}
```

### PATCH /orders/actions

Summary: Penyetujuan Order yang dikirim

Request:

- headers

```json
{
  "authorization": "String"
}
```

- body

```json
{
  "payload": ["Integer", "..."],
  "actionId": "Integer"
}
```

Response:

- "SUCCESS ACTION ORDER" ( _200_ )

```json
{
  "statusCode": "Integer",
  "status": "String",
  "payload": {
    "data": {
      "message": "String"
    }
  }
}
```

- "ERROR"
  - ( _403_ ) **FORBIDEN**
  - ( _404_ )

```json
{
  "statusCode": "Integer",
  "status": "ERROR",
  "payload": {
    "ErrorMessage": "String"
  }
}
```

### GET /orders/{id}

Summary: Mendapat Orders berdasarkan id

Request:

- headers

```json
{
  "authorization": "String"
}
```

- params

```json
{
  "id": "Integer"
}
```

Response:

- "SUCCESS GET ORDER" ( _200_ )

```json
{
  "statusCode": "Integer",
  "status": "String",
  "payload":
  {
    "data": {
      "id": 1,
      "AuthorId": 3,
      "qty": 25,
      "totalAmount": 325000,
      "createdAt": "2023-05-28T11:20:09.787Z",
      "updatedAt": "2023-05-28T11:20:09.787Z",
      "ProductOrders": [
        {"..."},
        "..."
      ]
    }
  }
}
```

- "ERROR"
  - ( _404_ )

```json
{
  "statusCode": "Integer",
  "status": "ERROR",
  "payload": {
    "ErrorMessage": "String"
  }
}
```

## Tags

### GET /tags

Summary: Mendapat Tags

Request:

- headers

```json
{
  "authorization": "String"
}
```

Response:

- "SUCCESS GET TAGS" ( _200_ )

```json
{
  "statusCode": "Integer",
  "status": "String",
  "payload":
  {
    "data": [
      {
        "id": "Integer",
        "name": "String",
        "..."
      },
      "..."
    ]
  }
}
```

### GET /tags/{id}

Summary: Mendapat Tag berdasarkan id

Request:

- headers

```json
{
  "authorization": "String"
}
```

- params

```json
{
  "id": "Integer"
}
```

Response:

- "SUCCESS GET TAG" ( _200_ )

```json
{
  "statusCode": "Integer",
  "status": "String",
  "payload":
  {
    "data":
    {
      "id": "Integer",
      "name": "String",
      "..."
    },
  }
}
```

- "ERROR"
  - ( _404_ )

```json
{
  "statusCode": "Integer",
  "status": "ERROR",
  "payload": {
    "ErrorMessage": "String"
  }
}
```

### PUT /tags/{id}

Summary: Memparbaruhi Tag berdasarkan id

Request:

- headers

```json
{
  "authorization": "String"
}
```

- params

```json
{
  "id": "Integer"
}
```

- body

```json
{
  "name": "String"
}
```

Response:

- "SUCCESS UPDATE TAG" ( _200_ )

```json
{
  "statusCode": "Integer",
  "status": "String",
  "payload":
  {
    "data":
    {
      "id": "Integer",
      "name": "String",
      "..."
    },
  }
}
```

- "ERROR"
  - ( _400_ ) **NAME IS REQUIRED**
  - ( _404_ )

```json
{
  "statusCode": "Integer",
  "status": "ERROR",
  "payload": {
    "ErrorMessage": "String"
  }
}
```

## Public

### GET /public/images/{fileName}

Response:

- ( _200_ )

```json
{
  "IMAGE"
}
```

## GLOBAL ERROR

Response:

- "ERROR"
  - ( _403_ ) **ACCESS TOKEN INVALID**
  - ( _500_ ) **INTERNAL SERVER ERROR**

```json
{
  "statusCode": "Integer",
  "status": "ERROR",
  "payload": {
    "ErrorMessage": "String"
  }
}
```
