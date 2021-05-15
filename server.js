const express = require('express');
const app = express();
const { graphqlHTTP } = require("express-graphql");
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql')
const port = 5000;

const authors = [
    { id: 1, name: 'J. K. Rowling' },
    { id: 2, name: 'J. R. R. Tolkien' },
    { id: 3, name: 'Brent Weeks' }
]

const books = [
    { id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
    { id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
    { id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
    { id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
    { id: 5, name: 'The Two Towers', authorId: 2 },
    { id: 6, name: 'The Return of the King', authorId: 2 },
    { id: 7, name: 'The Way of Shadows', authorId: 3 },
    { id: 8, name: 'Beyond the Shadows', authorId: 3 }
]


// defining schema/model
const AuthorType = new GraphQLObjectType({
    name: 'author',
    description: 'A list of authors',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(book => author.id === book.authorId)
            }
        }
    })
})

// defining schema/model
const BookType = new GraphQLObjectType({
    name: 'book',
    description: 'Represents a book written by an author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
})

// defining the root query, will have all the get queries
const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: ' The Root Query',
    fields: () => ({
        books: {
            type: new GraphQLList(BookType),
            description: 'A list of books',
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'A list of authors',
            resolve: () => authors
        },
        book: {
            type: BookType,
            description: 'Get Single Book',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => {
                return books.find(book => book.id === args.id)
            }
        },
        author: {
            type: AuthorType,
            description: 'Get Single Author',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => {
                return authors.find(author => author.id === args.id)
            }
        }
    })
})

// finally, declare the schema
const schema = new GraphQLSchema({
    query: RootQueryType
})

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true

}));




app.listen(port, () => console.log('server running at ', port));