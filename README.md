# PICSHARE

#### _Developed by_: _Nadia A. Tiwing_

### Description

> Allow users to share or upload photos with an option to enter a caption and categorized it by day

---

### Tools used:

**Framework & Languages**: NextJS(ReactJS + NodeJS), Typescript, CSS/SCSS, HTML5

**Database**: MongoDB Atlas

**Cloud-Based API**: Cloudinary - where I store images

---

### Pre-requisite:

1. Create account and connect database to [MongoDB Atlas](https://account.mongodb.com/account/register)
2. Create account and connect to [Cloudinary](https://cloudinary.com/users/register_free)
3. Create _.env file_, to enter the following credentials below

> `MONGODB_DB=<database_name>`

> `MONGODB_URI=mongodb+srv://<username>:<password>@<host>:<port>/<database>?retryWrites=true`

> `CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME`

4. _Name of the database collection: **picture_posts**_

### Installation:

1. git clone this repository
2. _npm install_
3. _npm run dev_

### Documentation:

- SCSS files
  - _variables.scss_ - stores reusable variables
  - _nav.scss_ - customized navigation bar
  - _cards.scss_ - customized input and post cards
- pages/config

  - _index.ts_ - contains server name
  - _mongodb.ts_ - contains database connection configuration

- pages/interface/index.ts
  - contains datatyped interfaces
- pages/util/date.ts
  - translate date into "Mm dd, yyyy" or "mm/dd/yyyy" format
- pages/api/
  - _create.ts_ - uploads the image in the cloudinary and save the post details in the database
  - _delete.ts_ - removes the image from cloudinary and deletes the selected post in the database
  - _update.ts_ - update the edited caption in the database
  - _posts.ts_ - get the saved posts from the database
- pages/components/
  - _header.tsx_ - contains head, title, meta, and link tags
  - _main.tsx_ - the whole main page
  - _navbar.tsx_ - contains the title of the app along with the filter selection
  - _input.tsx_ - where user create a new post
  - _postCard.tsx_ - displays all posts and each post card has an edit and delete options
  - _spinner.tsx_ - animating loader component
